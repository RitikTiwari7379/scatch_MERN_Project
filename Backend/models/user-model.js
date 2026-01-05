const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    minlength: 3,
    trim: true,
  },
  email: String,
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  password: String,
  orders: {
    type: Array,
    default: [],
  },
  picture: String,
  contact: Number,
});

module.exports = mongoose.model("user", userSchema);
