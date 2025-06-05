const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const order = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  total_price: {
    type: Number,
  },
  subtotal_price: {
    type: Number,
  },
  discount: {
    type: Number,
  },
  order_id: {
    type: String,
    default: uuidv4, // Auto-generate UUID
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  lat: {
    type: String,
  },
  long: {
    type: String,
  },
  phone_code: {
    type: String,
  },
  phone_number: {
    type: String,
  },
});

module.exports = mongoose.model("order", order);
