const express = require("express");
const app = express();
const expressSession = require("express-session");
const flash = require("connect-flash");
const cors = require("cors");
require("dotenv").config();

const ownerRouter = require("./routes/ownerRouter");
const productRouter = require("./routes/productRouter");
const userRouter = require("./routes/userRouter");
const indexRouter = require("./routes/index");
const paymentRouter = require("./routes/paymentRouter");
const apiRouter = require("./routes/api");

const bcrypt = require("bcrypt");
const path = require("path");

const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const userModel = require("./models/user-model");
const ownerModel = require("./models/owner-model");

const db = require("./config/mongoose-connection");

// Enable CORS for React frontend
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
// Populate template locals from tokens if present so header can react to logged-in state
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
    // ignore invalid user token
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
    // ignore invalid owner token
  }

  next();
});
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));

// Serve React build files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
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
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

const port = 3001;

app.listen(port, function (req, res) {
  console.log(`app is runnig on the server http://localhost:${port}`);
});
