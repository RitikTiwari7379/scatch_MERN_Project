const express = require("express");
const router = express.Router();
const product = require("../config/multer-config");
const productModel = require("../models/product-model");
const isOwnerLoggedIn = require("../middlewares/isOwnerLoggedIn");

router.post(
  "/create",
  isOwnerLoggedIn,
  product.single("image"),
  async function (req, res) {
    try {
      let { price, name, discount, bgcolor, textcolor, panelcolor } = req.body;

      if (!req.file) {
        if (
          req.path.includes("/api/") ||
          req.get("Content-Type") === "application/json" ||
          req.get("Accept") === "application/json"
        ) {
          return res.status(400).json({ error: "Image file is required" });
        }
        req.flash("error", "Image file is required");
        return res.redirect("/owners/admin");
      }

      let newProduct = await productModel.create({
        image: req.file.buffer,
        imageFilename: req.file.originalname,
        imageMimeType: req.file.mimetype,
        price: Number(price),
        name,
        discount: Number(discount) || 0,
        bgcolor: bgcolor || "#f3f4f6",
        textcolor: textcolor || "#374151",
        panelcolor: panelcolor || "#ffffff",
        owner: req.owner._id,
      });

      if (
        req.path.includes("/api/") ||
        req.get("Content-Type") === "application/json" ||
        req.get("Accept") === "application/json"
      ) {
        return res.json({
          success: true,
          message: "Product Created Successfully!",
          product: newProduct,
        });
      }
      req.flash("success", "Product Created Successfully!");
      return res.redirect("/owners/admin");
    } catch (err) {
      console.error("Product creation error:", err);
      if (
        req.path.includes("/api/") ||
        req.get("Content-Type") === "application/json" ||
        req.get("Accept") === "application/json"
      ) {
        return res
          .status(500)
          .json({ error: "Error creating product: " + err.message });
      }
      req.flash("error", "Error creating product: " + err.message);
      return res.redirect("/owners/admin");
    }
  }
);

// Edit product route
router.get("/edit/:id", isOwnerLoggedIn, async function (req, res) {
  try {
    let product = await productModel.findOne({
      _id: req.params.id,
      owner: req.owner._id,
    });
    if (!product) {
      if (
        req.path.includes("/api/") ||
        req.get("Content-Type") === "application/json" ||
        req.get("Accept") === "application/json"
      ) {
        return res
          .status(404)
          .json({ error: "Product not found or access denied" });
      }
      req.flash("error", "Product not found or access denied");
      return res.redirect("/owners/admin");
    }

    // For API requests, return JSON
    if (
      req.path.includes("/api/") ||
      req.get("Content-Type") === "application/json" ||
      req.get("Accept") === "application/json"
    ) {
      return res.json({ success: true, product });
    }

    // For non-production environments, redirect to React dev server with product ID
    if (process.env.NODE_ENV !== "production") {
      return res.redirect(
        `http://localhost:3000/products/edit/${req.params.id}`
      );
    }

    // In production, this will be handled by the catch-all route in app.js
    res
      .status(404)
      .send(
        "React app not built. Please run npm run build in client directory."
      );
  } catch (err) {
    if (
      req.path.includes("/api/") ||
      req.get("Content-Type") === "application/json" ||
      req.get("Accept") === "application/json"
    ) {
      return res.status(500).json({ error: "Error loading product" });
    }
    req.flash("error", "Error loading product");
    res.redirect("/owners/admin");
  }
});

// Update product route
router.put(
  "/edit/:id",
  isOwnerLoggedIn,
  product.single("image"),
  async function (req, res) {
    try {
      console.log("=== PUT /products/edit/:id ===");
      console.log("Headers:", req.headers);
      console.log("Accept header:", req.get("Accept"));
      console.log("Content-Type:", req.get("Content-Type"));
      console.log("Path:", req.path);
      console.log("Editing product with ID:", req.params.id);
      console.log("Edit data:", req.body);
      console.log("New image file:", req.file ? "Present" : "Not provided");

      let { price, name, discount, bgcolor, textcolor, panelcolor } = req.body;

      let updateData = {
        price: Number(price),
        name,
        discount: Number(discount) || 0,
        bgcolor: bgcolor || "#f3f4f6",
        textcolor: textcolor || "#374151",
        panelcolor: panelcolor || "#ffffff",
      };

      // Only update image if a new one is uploaded
      if (req.file) {
        updateData.image = req.file.buffer;
        updateData.imageFilename = req.file.originalname;
        updateData.imageMimeType = req.file.mimetype;
      }

      let updatedProduct = await productModel.findOneAndUpdate(
        { _id: req.params.id, owner: req.owner._id },
        updateData,
        { new: true }
      );

      if (!updatedProduct) {
        console.log("Product not found or access denied:", req.params.id);
        if (
          req.path.includes("/api/") ||
          req.get("Content-Type") === "application/json" ||
          req.get("Accept") === "application/json"
        ) {
          return res
            .status(404)
            .json({ error: "Product not found or access denied" });
        }
        req.flash("error", "Product not found or access denied");
        return res.redirect("/owners/admin");
      }

      console.log("Product updated successfully:", updatedProduct._id);

      if (
        req.path.includes("/api/") ||
        req.get("Content-Type") === "application/json" ||
        req.get("Accept") === "application/json"
      ) {
        return res.json({
          success: true,
          message: "Product updated successfully!",
          product: updatedProduct,
        });
      }
      req.flash("success", "Product updated successfully!");
      res.redirect("/owners/admin");
    } catch (err) {
      console.error("Product update error:", err);
      if (
        req.path.includes("/api/") ||
        req.get("Content-Type") === "application/json" ||
        req.get("Accept") === "application/json"
      ) {
        return res
          .status(500)
          .json({ error: "Error updating product: " + err.message });
      }
      req.flash("error", "Error updating product: " + err.message);
      res.redirect("/owners/admin");
    }
  }
);

// Delete product route
router.delete("/delete/:id", isOwnerLoggedIn, async function (req, res) {
  try {
    console.log("=== DELETE /products/delete/:id ===");
    console.log("Headers:", req.headers);
    console.log("Accept header:", req.get("Accept"));
    console.log("Content-Type:", req.get("Content-Type"));
    console.log("Path:", req.path);
    console.log("Deleting product with ID:", req.params.id);

    let deletedProduct = await productModel.findOneAndDelete({
      _id: req.params.id,
      owner: req.owner._id,
    });

    if (!deletedProduct) {
      console.log("Product not found or access denied:", req.params.id);
      if (
        req.path.includes("/api/") ||
        req.get("Content-Type") === "application/json" ||
        req.get("Accept") === "application/json"
      ) {
        return res
          .status(404)
          .json({ error: "Product not found or access denied" });
      }
      req.flash("error", "Product not found or access denied");
    } else {
      console.log("Product deleted successfully:", deletedProduct._id);
      if (
        req.path.includes("/api/") ||
        req.get("Content-Type") === "application/json" ||
        req.get("Accept") === "application/json"
      ) {
        return res.json({
          success: true,
          message: "Product deleted successfully!",
        });
      }
      req.flash("success", "Product deleted successfully!");
    }

    res.redirect("/owners/admin");
  } catch (err) {
    console.error("Product deletion error:", err);
    if (
      req.path.includes("/api/") ||
      req.get("Content-Type") === "application/json" ||
      req.get("Accept") === "application/json"
    ) {
      return res
        .status(500)
        .json({ error: "Error deleting product: " + err.message });
    }
    req.flash("error", "Error deleting product: " + err.message);
    res.redirect("/owners/admin");
  }
});

module.exports = router;
