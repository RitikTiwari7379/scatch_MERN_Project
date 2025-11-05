const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const router = express.Router();

router.get("/", function (req, res) {
  // For API requests, return JSON
  if (
    req.path.includes("/api/") ||
    req.get("Content-Type") === "application/json"
  ) {
    return res.json({ message: "Scatch API - Please use the React frontend" });
  }

  // For non-production environments, redirect to React dev server
  if (process.env.NODE_ENV !== "production") {
    return res.redirect("http://localhost:3000");
  }

  // In production, this will be handled by the catch-all route in app.js
  res
    .status(404)
    .send("React app not built. Please run npm run build in client directory.");
});

router.get("/shop", async function (req, res) {
  // For API requests, return JSON
  if (
    req.path.includes("/api/") ||
    req.get("Content-Type") === "application/json"
  ) {
    try {
      let products = await productModel.find().populate("owner");
      return res.json({ success: true, products });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch products" });
    }
  }

  // For non-production environments, redirect to React dev server
  if (process.env.NODE_ENV !== "production") {
    return res.redirect("http://localhost:3000/shop");
  }

  // In production, this will be handled by the catch-all route in app.js
  res
    .status(404)
    .send("React app not built. Please run npm run build in client directory.");
});

router.get("/cart", isLoggedIn, async function (req, res) {
  // For API requests, return JSON
  if (
    req.path.includes("/api/") ||
    req.get("Content-Type") === "application/json"
  ) {
    try {
      console.log("Fetching cart for user:", req.user.email);

      let user = await userModel.findOne({ email: req.user.email }).populate({
        path: "cart.product",
        populate: {
          path: "owner",
        },
      });

      console.log("User found:", user ? "Yes" : "No");

      // Ensure cart exists for legacy users
      if (!user.cart) {
        console.log("Creating new cart for user");
        user.cart = [];
      }

      console.log("Cart items count:", user.cart.length);

      let totalBill = 0;
      let platformFee = 20;

      user.cart.forEach((item, index) => {
        console.log(`Cart item ${index}:`, {
          product: item.product ? item.product._id : "null",
          quantity: item.quantity,
          price: item.product ? item.product.price : "null",
        });

        const price =
          item.product && item.product.price ? item.product.price : 0;
        const discount =
          item.product && item.product.discount ? item.product.discount : 0;
        const itemTotal = (price - discount) * (item.quantity || 0);
        totalBill += itemTotal;
      });

      const finalBill = totalBill + platformFee;

      console.log("Cart calculation:", { totalBill, platformFee, finalBill });

      return res.json({
        success: true,
        cart: user.cart,
        totalBill,
        platformFee,
        finalBill,
      });
    } catch (error) {
      console.error("Cart fetch error:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch cart: " + error.message });
    }
  }

  // For non-production environments, redirect to React dev server
  if (process.env.NODE_ENV !== "production") {
    return res.redirect("http://localhost:3000/cart");
  }

  // In production, this will be handled by the catch-all route in app.js
  res
    .status(404)
    .send("React app not built. Please run npm run build in client directory.");
});

router.get("/addtocart/:productid", isLoggedIn, async function (req, res) {
  try {
    console.log("Adding to cart - Product ID:", req.params.productid);
    console.log("User:", req.user.email);

    let user = await userModel.findOne({ email: req.user.email });
    console.log("User found:", user ? "Yes" : "No");

    // Ensure cart exists for legacy users
    if (!user.cart) {
      console.log("Creating new cart for user");
      user.cart = [];
    }

    // Check if product already exists in cart
    let existingCartItem = user.cart.find(
      (item) => item.product.toString() === req.params.productid
    );

    if (existingCartItem) {
      // Increment quantity if product already exists
      console.log("Product exists in cart, incrementing quantity");
      existingCartItem.quantity += 1;
    } else {
      // Add new product to cart
      console.log("Adding new product to cart");
      user.cart.push({
        product: req.params.productid,
        quantity: 1,
      });
    }

    await user.save();
    console.log("Cart updated successfully");

    if (
      req.path.includes("/api/") ||
      req.get("Content-Type") === "application/json" ||
      req.xhr ||
      req.accepts("json")
    ) {
      return res.json({ success: true, message: "Added to Cart!" });
    }
    req.flash("success", "Added to Cart!");
    return res.redirect("/shop");
  } catch (error) {
    console.error("Add to cart error:", error);
    if (
      req.path.includes("/api/") ||
      req.get("Content-Type") === "application/json" ||
      req.xhr ||
      req.accepts("json")
    ) {
      return res
        .status(500)
        .json({ error: "Error adding to cart: " + error.message });
    }
    req.flash("error", "Error adding to cart");
    return res.redirect("/shop");
  }
});

// Update cart item quantity
router.post("/updatecart/:productid", isLoggedIn, async function (req, res) {
  try {
    console.log("Updating cart - Product ID:", req.params.productid);
    console.log("Action:", req.body.action);
    console.log("User:", req.user.email);

    let user = await userModel.findOne({ email: req.user.email });
    let { action } = req.body; // 'increase' or 'decrease'

    // Ensure cart exists
    if (!user.cart) {
      console.log("Cart not found for user");
      user.cart = [];
    }

    let cartItem = user.cart.find(
      (item) => item.product.toString() === req.params.productid
    );

    if (cartItem) {
      console.log("Cart item found, current quantity:", cartItem.quantity);
      if (action === "increase") {
        cartItem.quantity += 1;
        console.log("Increased quantity to:", cartItem.quantity);
      } else if (action === "decrease") {
        cartItem.quantity -= 1;
        console.log("Decreased quantity to:", cartItem.quantity);
        if (cartItem.quantity <= 0) {
          console.log("Removing item from cart");
          user.cart = user.cart.filter(
            (item) => item.product.toString() !== req.params.productid
          );
        }
      }
      await user.save();
      console.log("Cart updated successfully");
    } else {
      console.log("Cart item not found");
    }

    if (
      req.path.includes("/api/") ||
      req.get("Content-Type") === "application/json" ||
      req.xhr ||
      req.accepts("json")
    ) {
      return res.json({ success: true, message: "Cart updated successfully" });
    }
    res.redirect("/cart");
  } catch (error) {
    console.error("Update cart error:", error);
    if (
      req.path.includes("/api/") ||
      req.get("Content-Type") === "application/json"
    ) {
      return res
        .status(500)
        .json({ error: "Error updating cart: " + error.message });
    }
    req.flash("error", "Error updating cart");
    res.redirect("/cart");
  }
});

// Remove item from cart
router.get("/removefromcart/:productid", isLoggedIn, async function (req, res) {
  try {
    console.log("Removing from cart - Product ID:", req.params.productid);
    console.log("User:", req.user.email);

    let user = await userModel.findOne({ email: req.user.email });

    // Ensure cart exists
    if (!user.cart) {
      console.log("Cart not found for user");
      user.cart = [];
    }

    console.log("Cart before removal:", user.cart.length, "items");
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== req.params.productid
    );
    console.log("Cart after removal:", user.cart.length, "items");

    await user.save();
    console.log("Cart updated successfully");

    if (
      req.path.includes("/api/") ||
      req.get("Content-Type") === "application/json" ||
      req.xhr ||
      req.accepts("json")
    ) {
      return res.json({ success: true, message: "Item removed from cart" });
    }
    req.flash("success", "Item removed from cart");
    res.redirect("/cart");
  } catch (error) {
    console.error("Remove from cart error:", error);
    if (
      req.path.includes("/api/") ||
      req.get("Content-Type") === "application/json"
    ) {
      return res
        .status(500)
        .json({ error: "Error removing item: " + error.message });
    }
    req.flash("error", "Error removing item");
    res.redirect("/cart");
  }
});

module.exports = router;
