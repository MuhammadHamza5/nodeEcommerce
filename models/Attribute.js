const  mongoose = require('mongoose');
const attribute = new mongoose.Schema({
     name: {
        type: String,
        required: true,
      },
      option: {
        type: String,
        required: true,
      }
});
module.exports = mongoose.model('attribute', attribute);
