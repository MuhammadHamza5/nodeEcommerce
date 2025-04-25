const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
app.use(express.static('public'));

const auth = require('../middleware/Auth');

const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// image code
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/user');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
// image code end


const authController = require('../controller/AuthController');
app.post('/registerd', upload.single('image') ,authController.register);
app.post('/login', authController.login);
app.post('/update-password',auth, authController.updatePassword);
app.post('/update-profile',auth, authController.updateProfile);
app.get('/profile',auth, authController.getProfile);
app.post('/reset-password', authController.resetPassword);
app.post('/verify-otp', authController.verifyOtp);



module.exports= app;