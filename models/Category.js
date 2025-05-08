const mongoose = require("mongoose");
const category = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  attribute: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "attribute",
      required: true,
    },
  ],
});

module.exports = mongoose.model("category", category);
