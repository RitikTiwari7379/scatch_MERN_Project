const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");

// Remove the development environment restriction for multiple owners
router.post("/create", async (req, res) => {
  try {
    let { fullname, email, password } = req.body;

    // Check if owner already exists
    let existingOwner = await ownerModel.findOne({ email: email });
    if (existingOwner) {
      if (
        req.path.includes("/api/") ||
        req.get("Content-Type") === "application/json"
      ) {
        return res
          .status(400)
          .json({ error: "Owner with this email already exists!" });
      }
      req.flash("error", "Owner with this email already exists!");
      return res.redirect("/owners/admin-auth");
    }

    // Hash the password
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) {
          if (
            req.path.includes("/api/") ||
            req.get("Content-Type") === "application/json"
          ) {
            return res.status(500).json({ error: "Error creating owner!" });
          }
          req.flash("error", "Error creating owner!");
          return res.redirect("/owners/admin-auth");
        }

        let createdOwner = await ownerModel.create({
          fullname,
          email,
          password: hash,
        });

        if (
          req.path.includes("/api/") ||
          req.get("Content-Type") === "application/json"
        ) {
          return res.json({
            success: true,
            message: "Owner created successfully!",
          });
        }
        req.flash("success", "Owner created successfully!");
        res.redirect("/owners/admin-auth");
      });
    });
  } catch (error) {
    if (
      req.path.includes("/api/") ||
      req.get("Content-Type") === "application/json"
    ) {
      return res.status(500).json({ error: "Error creating owner!" });
    }
    req.flash("error", "Error creating owner!");
    res.redirect("/owners/admin-auth");
  }
});

// Admin authentication page
router.get("/admin-auth", function (req, res) {
  // For API requests, return JSON
  if (
    req.path.includes("/api/") ||
    req.get("Content-Type") === "application/json"
  ) {
    return res.json({
      message: "Admin authentication - Please use the React frontend",
    });
  }

  // For non-production environments, redirect to React dev server
  if (process.env.NODE_ENV !== "production") {
    return res.redirect("http://localhost:3000/owners/admin-auth");
  }

  // In production, this will be handled by the catch-all route in app.js
  res
    .status(404)
    .send("React app not built. Please run npm run build in client directory.");
});

// Admin login
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    let owner = await ownerModel.findOne({ email: email });
    if (!owner) {
      if (
        req.path.includes("/api/") ||
        req.get("Content-Type") === "application/json"
      ) {
        return res.status(401).json({ error: "Email or Password incorrect!" });
      }
      req.flash("error", "Email or Password incorrect!");
      return res.redirect("/owners/admin-auth");
    }

    bcrypt.compare(password, owner.password, function (err, result) {
      if (result) {
        let token = generateToken(owner);
        res.cookie("ownertoken", token);

        if (
          req.path.includes("/api/") ||
          req.get("Content-Type") === "application/json"
        ) {
          return res.json({ success: true, message: "Admin login successful" });
        }
        return res.redirect("/owners/admin");
      } else {
        if (
          req.path.includes("/api/") ||
          req.get("Content-Type") === "application/json"
        ) {
          return res
            .status(401)
            .json({ error: "Email or Password incorrect!" });
        }
        req.flash("error", "Email or Password incorrect!");
        return res.redirect("/owners/admin-auth");
      }
    });
  } catch (error) {
    if (
      req.path.includes("/api/") ||
      req.get("Content-Type") === "application/json"
    ) {
      return res.status(500).json({ error: "Login failed!" });
    }
    req.flash("error", "Login failed!");
    res.redirect("/owners/admin-auth");
  }
});

// Admin logout
router.get("/logout", function (req, res) {
  // Clear both user and owner token cookies to ensure clean logout
  res.clearCookie("ownertoken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  if (
    req.path.includes("/api/") ||
    req.get("Content-Type") === "application/json"
  ) {
    return res.json({
      success: true,
      message: "Admin logged out successfully",
    });
  }
  res.redirect("/");
});

router.get("/admin", async function (req, res) {
  try {
    // Check if owner is logged in via token
    if (!req.cookies.ownertoken) {
      if (process.env.NODE_ENV !== "production") {
        return res.redirect("http://localhost:3000/owners/admin-auth");
      }
      return res.redirect("/owners/admin-auth");
    }

    const jwt = require("jsonwebtoken");
    let decoded = jwt.verify(req.cookies.ownertoken, process.env.JWT_KEY);
    let owner = await ownerModel.findOne({ email: decoded.email });

    if (!owner) {
      if (process.env.NODE_ENV !== "production") {
        return res.redirect("http://localhost:3000/owners/admin-auth");
      }
      return res.redirect("/owners/admin-auth");
    }

    // Get products created by this owner
    const productModel = require("../models/product-model");
    let products = await productModel.find({ owner: owner._id });

    // For API requests, return JSON
    if (
      req.path.includes("/api/") ||
      req.get("Content-Type") === "application/json"
    ) {
      return res.json({ success: true, owner, products });
    }

    // For non-production environments, redirect to React dev server
    if (process.env.NODE_ENV !== "production") {
      return res.redirect("http://localhost:3000/owners/admin");
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
      req.get("Content-Type") === "application/json"
    ) {
      return res.status(401).json({ error: "Please login again" });
    }

    if (process.env.NODE_ENV !== "production") {
      return res.redirect("http://localhost:3000/owners/admin-auth");
    }
    res.redirect("/owners/admin-auth");
  }
});

module.exports = router;
