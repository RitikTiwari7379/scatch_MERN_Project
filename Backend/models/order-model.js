const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "product", required: true },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }, // price per item in paise
  ownerId: { type: Schema.Types.ObjectId, ref: "owner" }, // owner of this product
});

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    items: { type: [OrderItemSchema], default: [] },
    amount: { type: Number, required: true }, // total amount in paise
    currency: { type: String, default: "INR" },
    razorpayOrderId: { type: String, required: true, unique: true },
    paymentId: { type: String },
    paymentSignature: { type: String },
    status: {
      type: String,
      enum: ["created", "paid", "captured", "failed", "refunded"],
      default: "created",
    },
    paidAt: { type: Date },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Indexes (removed duplicate razorpayOrderId index since it's already unique above)
OrderSchema.index({ user: 1, createdAt: -1 });

// Instance method: mark as paid
OrderSchema.methods.markPaid = async function (
  paymentId,
  signature,
  meta = {}
) {
  this.status = "paid";
  this.paymentId = paymentId;
  this.paymentSignature = signature;
  this.paidAt = new Date();
  this.meta = { ...(this.meta || {}), ...meta };
  await this.save();
  return this;
};

module.exports = mongoose.model("Order", OrderSchema);
