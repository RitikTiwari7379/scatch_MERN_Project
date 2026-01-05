const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async function (req, res, next) {
  if (!req.cookies.token) {
    // Check if this is an API route
    if (req.path.startsWith("/api/")) {
      return res
        .status(401)
        .json({ error: "Unauthorized - User login required" });
    }
    req.flash("error", "You need to login first");
    return res.redirect("/");
  }

  try {
    let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    let user = await userModel
      .findOne({ email: decoded.email })
      .select("-password");

    if (!user) {
      // Check if this is an API route
      if (req.path.startsWith("/api/")) {
        return res.status(401).json({ error: "User account not found" });
      }
      req.flash("error", "User account not found. Please login again.");
      return res.redirect("/");
    }
    req.user = user;
    // expose to templates
    res.locals.user = user;
    next();
  } catch (err) {
    // Check if this is an API route
    if (req.path.startsWith("/api/")) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.flash("error", "something went wrong!");
    return res.redirect("/");
  }
};
