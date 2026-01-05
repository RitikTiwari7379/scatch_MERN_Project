const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Models
const userModel = require("./models/user-model");
const ownerModel = require("./models/owner-model");

// Routes
const ownerRouter = require("./routes/ownerRouter");
const productRouter = require("./routes/productRouter");
const userRouter = require("./routes/userRouter");
const indexRouter = require("./routes/index");
const paymentRouter = require("./routes/paymentRouter");
const apiRouter = require("./routes/api");

// Database connection
require("./config/mongoose-connection");

const app = express();

// Enable CORS for React frontend
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Populate template locals from tokens if present
app.use(async function (req, res, next) {
  try {
    if (req.cookies && req.cookies.token) {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
      const user = await userModel
        .findOne({ email: decoded.email })
        .select("-password");
      if (user) res.locals.user = user;
    }
  } catch (err) {
    // Invalid user token
  }

  try {
    if (req.cookies && req.cookies.ownertoken) {
      const decodedOwner = jwt.verify(
        req.cookies.ownertoken,
        process.env.JWT_KEY
      );
      const owner = await ownerModel
        .findOne({ email: decodedOwner.email })
        .select("-password");
      if (owner) res.locals.owner = owner;
    }
  } catch (err) {
    // Invalid owner token
  }

  next();
});
app.use(express.static(path.join(__dirname, "public")));

// Serve React build files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Frontend-vite/dist")));
  app.use(express.static(path.join(__dirname, "client/build"))); // Fallback
}

// API routes
app.use("/api", apiRouter);
app.use("/", indexRouter);
app.use("/owners", ownerRouter);
app.use("/products", productRouter);
app.use("/users", userRouter);
app.use("/api/payments", paymentRouter);

// Serve React app for all other routes in production
if (process.env.NODE_ENV === "production") {
  app.get(/(.*)/, (req, res) => {
    const distPath = path.join(
      __dirname,
      "../Frontend-vite/dist",
      "index.html"
    );
    const clientBuildPath = path.join(__dirname, "client/build", "index.html");

    if (require("fs").existsSync(distPath)) {
      res.sendFile(distPath);
    } else {
      res.sendFile(clientBuildPath);
    }
  });
}

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
