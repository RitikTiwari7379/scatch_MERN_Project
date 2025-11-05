const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/order-model");
const userModel = require("../models/user-model");
const productModel = require("../models/product-model");
const mongoose = require("mongoose");

const razor = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order from user's cart
exports.createOrder = async (req, res) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res
        .status(401)
        .json({ success: false, error: "User not authenticated" });
    }

    // Get user with populated cart
    const user = await userModel.findOne({ email: userEmail }).populate({
      path: "cart.product",
      populate: { path: "owner" },
    });

    if (!user || !user.cart || user.cart.length === 0) {
      return res.status(400).json({ success: false, error: "Cart is empty" });
    }

    // Filter out cart items with null/missing products
    const validCartItems = user.cart.filter(
      (item) => item.product && item.product._id
    );

    if (validCartItems.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "No valid items in cart" });
    }

    // Calculate amount from server-side cart (secure)
    let subtotal = 0;
    const orderItems = [];

    for (const cartItem of validCartItems) {
      if (!cartItem.product) continue;

      const price = cartItem.product.price || 0;
      const discount = cartItem.product.discount || 0;
      const quantity = cartItem.quantity || 1;
      const itemTotal = (price - discount) * quantity;

      subtotal += itemTotal;

      orderItems.push({
        product: cartItem.product._id,
        qty: quantity,
        price: Math.round(itemTotal * 100), // store in paise
        ownerId: cartItem.product.owner._id,
      });
    }

    const platformFee = 20; // same as frontend
    const finalAmountRupees = subtotal + platformFee;
    const finalAmountPaise = Math.round(finalAmountRupees * 100);

    if (finalAmountPaise <= 0) {
      return res.status(400).json({ success: false, error: "Invalid amount" });
    }

    // Create Razorpay order
    const options = {
      amount: finalAmountPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now().toString().slice(-8)}_${user._id
        .toString()
        .slice(-8)}`, // Keep under 40 chars
      payment_capture: 1,
    };

    const razorOrder = await razor.orders.create(options);

    // Save order in database
    const order = await Order.create({
      user: user._id,
      items: orderItems,
      amount: finalAmountPaise,
      currency: "INR",
      razorpayOrderId: razorOrder.id,
      status: "created",
    });

    console.log("Order created:", order._id, "Razorpay Order:", razorOrder.id);

    return res.json({
      success: true,
      order: { id: razorOrder.id, amount: razorOrder.amount },
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("createOrder error", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to create order" });
  }
};

// Verify payment signature and update order
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, error: "Missing payment fields" });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.warn("Razorpay signature mismatch for order:", razorpay_order_id);
      return res
        .status(400)
        .json({ success: false, error: "Invalid payment signature" });
    }

    // Find and update order
    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        status: "paid",
        paymentId: razorpay_payment_id,
        paymentSignature: razorpay_signature,
        paidAt: new Date(),
      },
      { new: true }
    ).populate("user");

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    // Clear user's cart after successful payment
    try {
      await userModel.findByIdAndUpdate(order.user._id, { cart: [] });
      console.log("Cart cleared for user:", order.user._id);
    } catch (cartError) {
      console.error("Failed to clear cart:", cartError);
    }

    console.log("Payment verified and order updated:", order._id);

    return res.json({ success: true, order });
  } catch (err) {
    console.error("verifyPayment error", err);
    return res
      .status(500)
      .json({ success: false, error: "Verification failed" });
  }
};

// Get owner revenue (for admin dashboard)
exports.getOwnerRevenue = async (req, res) => {
  try {
    const ownerEmail = req.owner?.email;
    if (!ownerEmail) {
      return res
        .status(401)
        .json({ success: false, error: "Owner not authenticated" });
    }

    // Get owner ID
    const ownerModel = require("../models/owner-model");
    const owner = await ownerModel.findOne({ email: ownerEmail });
    if (!owner) {
      return res.status(401).json({ success: false, error: "Owner not found" });
    }

    // Aggregate revenue from paid orders where this owner sold products
    const revenueAgg = await Order.aggregate([
      { $unwind: "$items" },
      {
        $match: {
          "items.ownerId": owner._id,
          status: { $in: ["paid", "captured"] },
        },
      },
      {
        $group: {
          _id: null,
          totalPaise: { $sum: "$items.price" },
        },
      },
    ]);

    const totalPaise = revenueAgg[0]?.totalPaise || 0;
    const totalRupees = +(totalPaise / 100).toFixed(2);

    return res.json({
      success: true,
      totalPaise,
      totalRupees,
    });
  } catch (err) {
    console.error("getOwnerRevenue error", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
