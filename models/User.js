const mongoose = require("mongoose");
const User = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  email_verified_at: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("user", User);
