const  mongoose = require('mongoose');
const product = new mongoose.Schema({
     name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      descount_price: {
        type: Number,
        required: true,
      },
      status: {
        type: Number,
        required: true,
      },
      stock: {
        type: Number,
        required: true,
      },
      seller: {
        type: mongoose.Schema.ObjectId,
        ref: 'seller_data',
        required: true,
      },
      category: {
        type: mongoose.Schema.ObjectId,
        ref: 'category',
        required: true,
      }
     
     
});
module.exports = mongoose.model('product', product);
