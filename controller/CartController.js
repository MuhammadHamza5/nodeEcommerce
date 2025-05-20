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
      }

      const cartData = new cartModel({
        user: auth.user._id,
        product: product._id,
        shop: product.seller,
        quantity: quantity,
      });
      cartData.save();
      for (const cartAttribute of cartAttributes) {
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

    if (!auth) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    // Get all cart items for the user and populate product, category, shop, and user
    const cartData = await cartModel
      .find({ user: auth.user._id })
      .populate(["user", "product", "shop"])
      .populate({ path: "product", populate: { path: "category" } });

    if (!cartData || cartData.length === 0) {
      return response
        .status(404)
        .json({ status: false, data: null, message: "Cart Is Empty" });
    }

    // Group by shop
    const groupedByShop = {};
    let totalPrice = 0;

    for (const item of cartData) {
      const shopId = item.shop._id.toString();

      // Fetch attributes for each cart item
      const attributes = await cartAttributeModel
        .find({ cart: item._id })
        .populate("product_attribute");

      // Add attributes to cart item
      const itemWithAttributes = {
        ...item.toObject(),
        attributes: attributes,
      };

      // Calculate total price
      const price =
        item.product.descount_price > 0
          ? item.product.descount_price
          : item.product.price;

      totalPrice += price * item.quantity;

      // Group by shop
      if (!groupedByShop[shopId]) {
        groupedByShop[shopId] = {
          shop_id: item.shop._id,
          shop_name: item.shop.shop_name,
          cart_data: [],
        };
      }

      groupedByShop[shopId].cart_data.push(itemWithAttributes);
    }

    const result = Object.values(groupedByShop);

    return response.status(200).send({
      status: true,
      data: result,
      total_price: totalPrice,
      message: "Get Cart Success",
    });
  } catch (error) {
    console.error("Get Cart Error:", error);
    return response.status(500).send({ status: false, message: error.message });
  }
};

const updateQuantity = async (request, response) => {
  try {
    const auth = request.user;
    const cartId = request.body.cart_id;
    const quantity = request.body.quantity;
    const cartData = await cartModel.findOne({
      _id: cartId,
      user: auth.user._id,
    });
    if (!cartData) {
      return response
        .status(404)
        .send({ status: false, message: "Cart not found" });
    }

    await cartModel.updateOne(
      { _id: cartData._id },
      {
        $set: {
          quantity: quantity,
        },
      }
    );

    return response.status(200).send({
      status: true,
      data: null,
      message: "Cart Quantity Update Success",
    });
  } catch (error) {
    console.error("Get Cart Error:", error);
    return response.status(500).send({ status: false, message: error.message });
  }
};

const clearCart = async (request, response) => {
  try {
    const auth = request.user;
    const cartData = await cartModel.find({ user: auth.user._id });
    if (!cartData) {
      return response
        .status(404)
        .send({ status: false, message: "Cart not found" });
    }
    for (const cart of cartData) {
      await cartAttributeModel.deleteMany({ cart: cart._id });
    }
    await cartModel.deleteMany({ user: auth.user._id });

    return response.status(200).send({
      status: true,
      data: null,
      message: "Cart Delete Success",
    });
  } catch (error) {
    console.error("Get Cart Error:", error);
    return response.status(500).send({ status: false, message: error.message });
  }
};

// const clearCart = async (request, response) => {
//   try {
//     const auth = request.user;

//     const cartData = await cartModel.find({ user: auth.user._id });
//     if (!cartData || cartData.length === 0) {
//       return response
//         .status(404)
//         .send({ status: false, message: "Cart not found" });
//     }

//     for (const cart of cartData) {
//       await cartAttributeModel.deleteMany({ cart: cart._id });
//     }

//     await cartModel.deleteMany({ user: auth.user._id });

//     return response.status(200).send({
//       status: true,
//       data: null,
//       message: "Cart Delete Success",
//     });
//   } catch (error) {
//     console.error("Clear Cart Error:", error);
//     return response.status(500).send({ status: false, message: error.message });
//   }
// };

const clearCartById = async (request, response) => {
  try {
    const auth = request.user;
    const cartId = request.body.cart_id;
    const cartData = await cartModel.findOne({
      _id: cartId,
      user: auth.user._id,
    });
    if (!cartData) {
      return response
        .status(404)
        .send({ status: false, message: "Cart not found" });
    }
    await cartAttributeModel.deleteMany({ cart: cartId });
    await cartModel.findByIdAndDelete({ _id: cartId, user: auth.user._id });

    return response.status(200).send({
      status: true,
      data: null,
      message: "Cart Delete Success",
    });
  } catch (error) {
    console.error("Get Cart Error:", error);
    return response.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateQuantity,
  clearCart,
  clearCartById,
};
