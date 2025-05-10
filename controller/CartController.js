const cartModel = require("../models/Cart");
const productModel = require("../models/Product");
const sellerDataModel = require("../models/SellerData");
const productAttributeModel = require("../models/ProductAttribute");
const cartAttributeModel = require("../models/CartAttribute");
const addToCart = async (request, response) => {
  try {
    const auth = request.user;
    const productId = request.body.product_id;
    const quantity = request.body.quantity;
    const cartAttributes = request.body.cart_attribute;
    if (auth) {
      const product = await productModel.findOne({ _id: productId });
      if (!product) {
        return response.status(404).json({ message: "Product not found" });
      }

      const cartData = new cartModel({
        user: auth.user._id,
        product: product._id,
        shop: product.seller,
        quantity: quantity,
      });
      cartData.save();
      for (const cartAttribute of cartAttributes) {
        const productAttribute = await productAttributeModel.findOne({
          _id: cartAttribute.attribute_id,
          product: product._id,
        });
        if (!productAttribute) {
          return response
            .status(404)
            .json({ message: "Product Attribute not found" });
        }
        const cartAttributeData = new cartAttributeModel({
          cart: cartData._id,
          product_attribute: cartAttribute.attribute_id,
        });
        cartAttributeData.save();
      }
      return response.status(200).send({
        status: true,
        data: null,
        message: "Add to Cart Success",
      });
    }
  } catch (error) {
    return response.status(500).send(error.message);
  }
};

const getCart = async (request, response) => {
  try {
    const auth = request.user;
    const sellerData = [];
    let result = [];
    let totalPrice = 0;
    if (auth) {
      const cartData = await cartModel
        .find({ user: auth.user._id })
        .populate(["user", "product", "shop"])
        .populate({
          path: "product",
          populate: { path: "category" },
        });

      for (const data of cartData) {
        const seller = await sellerDataModel.findOne({ _id: data.shop._id });
        sellerData.push(seller);

        if (data.product.descount_price > 0) {
          totalPrice += data.product.descount_price * data.quantity;
        } else {
          totalPrice += data.product.price * data.quantity;
        }
      }
      
      let array = [];
      for (const SellerDatas of sellerData) {
        const cartData = await cartModel
          .find({ user: auth.user._id, shop: SellerDatas._id })
          .populate(["user", "product", "shop"])
          .populate({
            path: "product",
            populate: { path: "category" },
          });

        if (!cartData) {
          return res.status(404).json({ message: "Cart not found" });
        }
       array.push({
          shop_id: SellerDatas._id,
          shop_name: SellerDatas.shop_name,
          cart_data: cartData,
        })
        result = array;
      }

      return response.status(200).send({
        status: true,
        data: result,
        message: "Get Cart Success",
      });

    }
  } catch (error) {
    return response.status(500).send(error.message);
  }




  
};

module.exports = {
  addToCart,
  getCart,
};
