const  mongoose = require('mongoose');
const attribute = new mongoose.Schema({
     name: {
        type: String,
        required: true,
      },
      option: [{
        type: String,
      }],
      option_code: [{
        type: String,
      }]

});
module.exports = mongoose.model('attribute', attribute);
