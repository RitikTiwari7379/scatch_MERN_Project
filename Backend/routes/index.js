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
      let products = await productModel.find().populate("owner").lean();
      const productsJSON = products.map((p) => {
        if (p.image) {
          let buffer;
          if (Buffer.isBuffer(p.image)) {
            buffer = p.image;
          } else if (p.image.type === "Buffer" && Array.isArray(p.image.data)) {
            buffer = Buffer.from(p.image.data);
          } else if (p.image.buffer && Buffer.isBuffer(p.image.buffer)) {
            // Handle MongoDB Binary object (from .lean())
            buffer = p.image.buffer;
          }
          if (buffer) {
            const mimeType = p.imageMimeType || "image/png";
            p.image = `data:${mimeType};base64,${buffer.toString("base64")}`;
          }
        }
        return p;
      });
      return res.json({ success: true, products: productsJSON });
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
      let user = await userModel.findOne({ email: req.user.email }).populate({
        path: "cart.product",
        populate: {
          path: "owner",
        },
      });

      // Ensure cart exists for legacy users
      if (!user.cart) {
        user.cart = [];
      }
      let totalBill = 0;
      let platformFee = 20;

      user.cart.forEach((item) => {
        const price =
          item.product && item.product.price ? item.product.price : 0;
        const discount =
          item.product && item.product.discount ? item.product.discount : 0;
        const itemTotal = (price - discount) * (item.quantity || 0);
        totalBill += itemTotal;
      });

      const finalBill = totalBill + platformFee;

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
    let user = await userModel.findOne({ email: req.user.email });

    // Ensure cart exists for legacy users
    if (!user.cart) {
      user.cart = [];
    }

    let existingCartItem = user.cart.find(
      (item) => item.product.toString() === req.params.productid
    );

    if (existingCartItem) {
      // Increment quantity if product already exists
      existingCartItem.quantity += 1;
    } else {
      // Add new product to cart
      user.cart.push({
        product: req.params.productid,
        quantity: 1,
      });
    }

    await user.save();

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
    let user = await userModel.findOne({ email: req.user.email });
    let { action } = req.body; // 'increase' or 'decrease'

    // Ensure cart exists
    if (!user.cart) {
      user.cart = [];
    }

    let cartItem = user.cart.find(
      (item) => item.product.toString() === req.params.productid
    );

    if (cartItem) {
      if (action === "increase") {
        cartItem.quantity += 1;
      } else if (action === "decrease") {
        cartItem.quantity -= 1;
        if (cartItem.quantity <= 0) {
          user.cart = user.cart.filter(
            (item) => item.product.toString() !== req.params.productid
          );
        }
      }
      await user.save();
      if (
        req.path.includes("/api/") ||
        req.get("Content-Type") === "application/json" ||
        req.xhr ||
        req.accepts("json")
      ) {
        return res.json({
          success: true,
          message: "Cart updated successfully",
        });
      }
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
    let user = await userModel.findOne({ email: req.user.email });

    // Ensure cart exists
    if (!user.cart) {
      user.cart = [];
    }

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== req.params.productid
    );

    await user.save();

    if (
      req.path.includes("/api/") ||
      req.get("Content-Type") === "application/json" ||
      req.xhr ||
      req.accepts("json")
    ) {
      return res.json({ success: true, message: "Removed from Cart!" });
    }
    req.flash("success", "Removed from Cart!");
    res.redirect("/cart");
  } catch (error) {
    console.error("Remove from cart error:", error);
    if (
      req.path.includes("/api/") ||
      req.get("Content-Type") === "application/json" ||
      req.xhr ||
      req.accepts("json")
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
