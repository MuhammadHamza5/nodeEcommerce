const mongoose = require("mongoose");
const orderProductId = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
    required: true,
  },
   product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "seller_data",
    required: true,
  },
  quantity: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "rejected", "accepted","refunded"],
    default: "pending", // optional: default value
  },
});

module.exports = mongoose.model("order_product_id", orderProductId);
