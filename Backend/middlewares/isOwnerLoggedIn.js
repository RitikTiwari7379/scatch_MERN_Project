const jwt = require("jsonwebtoken");
const ownerModel = require("../models/owner-model");

module.exports = async function (req, res, next) {
  if (!req.cookies.ownertoken) {
    // Check if this is an API route
    if (req.path.startsWith("/api/")) {
      return res
        .status(401)
        .json({ error: "Unauthorized - Admin login required" });
    }
    req.flash("error", "You need to login first");
    return res.redirect("/owners/admin-auth");
  }

  try {
    let decoded = jwt.verify(req.cookies.ownertoken, process.env.JWT_KEY);
    let owner = await ownerModel
      .findOne({ email: decoded.email })
      .select("-password");
    req.owner = owner;
    // expose to templates
    res.locals.owner = owner;
    next();
  } catch (err) {
    // Check if this is an API route
    if (req.path.startsWith("/api/")) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.flash("error", "something went wrong!");
    res.redirect("/owners/admin-auth");
  }
};
