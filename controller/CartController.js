const cartModel = require("../models/Cart");
const productModel = require("../models/Product");
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
        const productAttribute = await productAttributeModel.findOne({ _id: cartAttribute.attribute_id , product: product._id });
        if (!productAttribute) {
          return response.status(404).json({ message: "Product Attribute not found" });
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

module.exports = {
    addToCart,
}