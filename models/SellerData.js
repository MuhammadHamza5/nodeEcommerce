const mongoose = require("mongoose");
const SellerData = mongoose.Schema({
  shop_name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  zip_code: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  lat: {
    type: String,
    required: true,
  },
  long: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // refers to the 'user' model
    required: true,
  },
});

module.exports = mongoose.model("seller_data", SellerData);
