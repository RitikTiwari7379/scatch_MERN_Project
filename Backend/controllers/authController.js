const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async function (req, res) {
  try {
    let { email, fullname, password } = req.body;

    let user = await userModel.findOne({ email: email });
    if (user) {
      if (
        req.path.includes("/api/") ||
        req.get("Content-Type") === "application/json"
      ) {
        return res
          .status(401)
          .json({ error: "You already have an account, Please Login!" });
      }
      return res.status(401).send("You already have an account, Please Login!");
    }

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) {
          if (
            req.path.includes("/api/") ||
            req.get("Content-Type") === "application/json"
          ) {
            return res.status(500).json({ error: "Registration failed" });
          }
          return res.send(err.message);
        } else {
          const user = await userModel.create({
            email,
            fullname,
            password: hash,
          });

          let token = generateToken(user);
          res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          });

          if (
            req.path.includes("/api/") ||
            req.get("Content-Type") === "application/json"
          ) {
            return res.json({
              success: true,
              message: "User registered successfully",
            });
          }
          return res.redirect("/shop");
        }
      });
    });
  } catch (err) {
    if (
      req.path.includes("/api/") ||
      req.get("Content-Type") === "application/json"
    ) {
      return res.status(500).json({ error: "Registration failed" });
    }
    res.send(err.message);
  }
};

module.exports.loginUser = async (req, res) => {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email: email });
  if (!user) {
    if (
      req.path.includes("/api/") ||
      req.get("Content-Type") === "application/json"
    ) {
      return res.status(401).json({ error: "Email or Password incorrect!" });
    }
    return res.send("Email or Password incorrect!");
  }

  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      let token = generateToken(user);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      if (
        req.path.includes("/api/") ||
        req.get("Content-Type") === "application/json"
      ) {
        return res.json({ success: true, message: "Login successful" });
      }
      return res.redirect("/shop");
    } else {
      if (
        req.path.includes("/api/") ||
        req.get("Content-Type") === "application/json"
      ) {
        return res.status(401).json({ error: "Email or Password incorrect!" });
      }
      return res.send("Email or Password incorrect!");
    }
  });
};

module.exports.logOut = function (req, res) {
  // Clear both user and owner token cookies to ensure clean logout
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.clearCookie("ownertoken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  if (
    req.path.includes("/api/") ||
    req.get("Content-Type") === "application/json"
  ) {
    return res.json({ success: true, message: "Logged out successfully" });
  }
  res.redirect("/");
};
