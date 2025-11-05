const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    price: Number,
    image: Buffer,
    name: String,
    discount: {
      type: Number,
      default: 0,
    },
    bgcolor: String,
    textcolor: String,
    panelcolor: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "owner",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Ensure virtual fields are included in JSON output
productSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    // Convert image buffer to base64 string for frontend
    if (ret.image && Buffer.isBuffer(ret.image)) {
      ret.image = ret.image.toString("base64");
    }
    return ret;
  },
});

productSchema.set("toObject", {
  virtuals: true,
  transform: function (doc, ret) {
    // Convert image buffer to base64 string
    if (ret.image && Buffer.isBuffer(ret.image)) {
      ret.image = ret.image.toString("base64");
    }
    return ret;
  },
});

module.exports = mongoose.model("product", productSchema);
