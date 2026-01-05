const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    price: Number,
    image: Buffer,
    imageFilename: String,
    imageMimeType: String,
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
    // Convert image buffer to data URI for frontend
    if (ret.image && Buffer.isBuffer(ret.image)) {
      const mimeType = ret.imageMimeType || "image/png";
      ret.image = `data:${mimeType};base64,${ret.image.toString("base64")}`;
    }
    return ret;
  },
});

productSchema.set("toObject", {
  virtuals: true,
  transform: function (doc, ret) {
    // Convert image buffer to data URI
    if (ret.image && Buffer.isBuffer(ret.image)) {
      const mimeType = ret.imageMimeType || "image/png";
      ret.image = `data:${mimeType};base64,${ret.image.toString("base64")}`;
    }
    return ret;
  },
});

module.exports = mongoose.model("product", productSchema);
