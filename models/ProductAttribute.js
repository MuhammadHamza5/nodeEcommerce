const mongoose = require("mongoose");
const productAttribute = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  quantity: {
    type: Number,
    required: true,
  },
  color_code: {
    type: Number,
  },
  attribute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "attribute",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
});

module.exports = mongoose.model("product_attribute", productAttribute);
