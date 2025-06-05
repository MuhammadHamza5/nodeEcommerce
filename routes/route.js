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
const sellerDataController = require('../controller/SellerDataController');
const productController = require('../controller/ProductController');
const categoryController = require('../controller/CategoryController');
const attributeController = require('../controller/AttributeController');
const cartController = require('../controller/CartController');


app.post('/registerd', upload.single('image') ,authController.register);
app.post('/login', authController.login);
app.post('/update-password',auth, authController.updatePassword);
app.post('/update-profile',auth, authController.updateProfile);
app.get('/profile',auth, authController.getProfile);
app.post('/reset-password', authController.resetPassword);
app.post('/verify-otp', authController.verifyOtp);


app.post('/seller/create-shop',auth, sellerDataController.createSellerShop);
app.post('/seller/update-shop',auth, sellerDataController.updateSellerShop);
app.get('/seller/shop',auth, sellerDataController.getSellerShop);

// create product
app.post('/seller/create-product',auth, productController.productCreate);
app.post('/seller/update-product',auth, productController.productUpdate);
app.get('/seller/products',auth, productController.products);
app.get('/seller/product-by-id/:id',auth, productController.productById);
app.post('/seller/product-active-inactive',auth, productController.productActiveInactive);

//  product user route

app.get('/user/products', productController.userProducts);
app.get('/user/product-by-id/:id', productController.userProductById);

//  cart user route

app.post('/cart/store-update',auth, cartController.addToCart);
app.get('/cart/get-cart',auth, cartController.getCart);
app.post('/cart/update-quantity',auth, cartController.updateQuantity);
app.post('/cart/clear',auth, cartController.clearCart);
app.post('/cart/delete-by-id',auth, cartController.clearCartById);
app.post('/cart/checkout',auth, cartController.checkout);

// category
app.post('/category/create',auth, categoryController.createCategory);
app.post('/category/update',auth, categoryController.updateCategory);
app.get('/categories', categoryController.categories);
app.get('/category/:id', categoryController.categoryById);
app.post('/category/delete',auth, categoryController.categoryDelete);
app.post('/category/link-attribute',auth, categoryController.categoryAttributeLink);

// attribute
app.post('/attribute/create',auth, attributeController.createAttribute);
app.post('/attribute/update',auth, attributeController.updateAttribute);
app.get('/attributes', attributeController.attributes);
app.get('/attribute/:id', attributeController.attributeById);
app.post('/attribute/delete',auth, attributeController.attributeDelete);

module.exports= app;