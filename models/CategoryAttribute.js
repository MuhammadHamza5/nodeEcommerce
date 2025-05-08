const mongoose = require("mongoose");
const CategoryAttribute = mongoose.Schema({
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category", 
    required: true,
  },
  attribute_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "attribute", 
    required: true,
  }
});


module.exports = mongoose.model("category_attribute", CategoryAttribute);
