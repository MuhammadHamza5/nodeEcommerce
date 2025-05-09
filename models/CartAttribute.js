const mongoose = require("mongoose");
const cartAttribute = new mongoose.Schema({
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cart",
    required: true,
  },
  product_attribute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product_attribute",
    required: true,
  }
  
});

module.exports = mongoose.model("cart_attribute", cartAttribute);
