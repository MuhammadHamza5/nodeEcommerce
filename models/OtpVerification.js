const mongoose = require('mongoose');
const OtpVerification = mongoose.Schema({
    user_id:{
        type:String
    },
    code:{
        type:Number
    },
    status_reg:{
        type:Number
    },
    status_pass_res:{
        type:Number
    }
});

module.exports = mongoose.model('otp_verification',OtpVerification);