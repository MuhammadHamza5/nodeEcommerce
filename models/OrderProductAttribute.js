const mongoose = require("mongoose");
const orderProductAttribute = new mongoose.Schema({
  order_product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order_product_id",
    required: true,
  },
   attribute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product_attribute",
    required: true,
  },
  color: {
    type: String,
  },
  name: {
    type: String,
  },
});

module.exports = mongoose.model("order_product_attribute", orderProductAttribute);
