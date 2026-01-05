const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isOwnerLoggedIn = require("../middlewares/isOwnerLoggedIn");

router.post("/create-order", isLoggedIn, paymentController.createOrder);
router.post("/verify", isLoggedIn, paymentController.verifyPayment);
router.get(
  "/owner-revenue",
  isOwnerLoggedIn,
  paymentController.getOwnerRevenue
);

module.exports = router;
