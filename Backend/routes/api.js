const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");
const ownerModel = require("../models/owner-model");
const productModel = require("../models/product-model");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isOwnerLoggedIn = require("../middlewares/isOwnerLoggedIn");

// Check authentication status
router.get("/auth/check", async (req, res) => {
  try {
    let user = null;
    let owner = null;

    // Check user token
    if (req.cookies && req.cookies.token) {
      try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        user = await userModel
          .findOne({ email: decoded.email })
          .select("-password");
      } catch (err) {
        // Invalid user token
      }
    }

    // Check owner token
    if (req.cookies && req.cookies.ownertoken) {
      try {
        const decodedOwner = jwt.verify(
          req.cookies.ownertoken,
          process.env.JWT_KEY
        );
        owner = await ownerModel
          .findOne({ email: decodedOwner.email })
          .select("-password");
      } catch (err) {
        // Invalid owner token
      }
    }

    res.json({ user, owner });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all products for shop page
router.get("/products", async (req, res) => {
  try {
    const products = await productModel.find().populate("owner");
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get cart data
router.get("/cart", isLoggedIn, async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email }).populate({
      path: "cart.product",
      populate: {
        path: "owner",
      },
    });

    // Ensure cart exists for legacy users
    if (!user.cart) user.cart = [];

    // Filter out cart items with null/missing products
    const validCartItems = user.cart.filter(
      (item) => item.product && item.product._id
    );

    // Update user cart if we found invalid items
    if (validCartItems.length !== user.cart.length) {
      console.log(
        `Removing ${
          user.cart.length - validCartItems.length
        } invalid cart items for user ${user.email}`
      );
      user.cart = validCartItems;
      await user.save();
    }

    let totalBill = 0;
    let platformFee = 20;

    validCartItems.forEach((item) => {
      const price = item.product && item.product.price ? item.product.price : 0;
      const discount =
        item.product && item.product.discount ? item.product.discount : 0;
      const itemTotal = (price - discount) * (item.quantity || 0);
      totalBill += itemTotal;
    });

    const finalBill = totalBill + platformFee;

    res.json({
      success: true,
      cart: validCartItems,
      totalBill,
      platformFee,
      finalBill,
    });
  } catch (error) {
    console.error("Cart API error:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// Get admin products
router.get("/admin/products", isOwnerLoggedIn, async (req, res) => {
  try {
    const owner = await ownerModel.findOne({ email: req.owner.email });
    const products = await productModel.find({ owner: owner._id });
    res.json({ success: true, products, owner });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin products" });
  }
});

module.exports = router;
