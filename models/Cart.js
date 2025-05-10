const mongoose = require("mongoose");
const cart = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "seller_data",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  guest_user_id: {
    type: Number,
  },
});

module.exports = mongoose.model("cart", cart);
