const cartModel = require("../models/Cart");
const productModel = require("../models/Product");
const sellerDataModel = require("../models/SellerData");
const productAttributeModel = require("../models/ProductAttribute");
const cartAttributeModel = require("../models/CartAttribute");
const orderModel = require("../models/Order");
const orderProductModel = require("../models/OrderProductId");
const orderProductAttributeModel = require("../models/OrderProductAttribute");

// const addToCart = async (request, response) => {

//   try {
//     const auth = request.user;
//     const productId = request.body.product_id;
//     const quantity = request.body.quantity;
//     const cartAttributes = request.body.cart_attribute;
//     if (auth) {
//       const product = await productModel.findOne({ _id: productId });
//       if (!product) {
//         return response.status(404).json({ message: "Product not found" });
//       }
//       for (const cartAttribute of cartAttributes) {
//         const productAttribute = await productAttributeModel.findOne({
//           _id: cartAttribute.attribute_id,
//           product: product._id,
//         });
//         if (!productAttribute) {
//           return response
//             .status(404)
//             .json({ message: "Product Attribute not found" });
//         }
//       }

//       const checkCartData = await cartModel.find({
//         user: auth.user._id,
//         product: productId,
//       });
//       if (checkCartData) {
//         for (const cartAttribute of cartAttributes) {
//           const checkCartAttribute = await cartAttributeModel.findOne({
//             product_attribute: cartAttribute.attribute_id,
//             cart: checkCartData._id,
//           });

//         }
//         return response
//           .status(400)
//           .json({ message: "Product already in cart" });
//       }

//       const cartData = new cartModel({
//         user: auth.user._id,
//         product: product._id,
//         shop: product.seller,
//         quantity: quantity,
//       });
//       cartData.save();
//       for (const cartAttribute of cartAttributes) {
//         const cartAttributeData = new cartAttributeModel({
//           cart: cartData._id,
//           product_attribute: cartAttribute.attribute_id,
//         });
//         cartAttributeData.save();
//       }
//       return response.status(200).send({
//         status: true,
//         data: null,
//         message: "Add to Cart Success",
//       });
//     }
//   } catch (error) {
//     return response.status(500).send(error.message);
//   }
// };

const addToCart = async (request, response) => {
  try {
    const auth = request.user;
    const { product_id, quantity, cart_attribute } = request.body;

    if (!auth) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const product = await productModel.findById(product_id);
    if (!product) {
      return response.status(404).json({ message: "Product not found" });
    }

    for (const attr of cart_attribute) {
      const productAttribute = await productAttributeModel.findOne({
        _id: attr.attribute_id,
        product: product._id,
      });
      if (!productAttribute) {
        return response
          .status(404)
          .json({ message: "Product Attribute not found" });
      }
    }

    const existingCarts = await cartModel.find({
      user: auth.user._id,
      product: product_id,
    });

    for (const cart of existingCarts) {
      const existingAttributes = await cartAttributeModel.find({
        cart: cart._id,
      });

      const existingAttrIds = existingAttributes
        .map((a) => a.product_attribute.toString())
        .sort();
      const newAttrIds = cart_attribute
        .map((a) => a.attribute_id.toString())
        .sort();

      const isSameAttributes =
        existingAttrIds.length === newAttrIds.length &&
        existingAttrIds.every((val, index) => val === newAttrIds[index]);

      if (isSameAttributes) {
        cart.quantity = Number(cart.quantity) + Number(quantity);
        await cart.save();
        return response.status(200).json({
          status: true,
          message: "Cart updated: quantity increased",
        });
      }
    }

    const newCart = new cartModel({
      user: auth.user._id,
      product: product._id,
      shop: product.seller,
      quantity: quantity,
    });
    await newCart.save();

    for (const attr of cart_attribute) {
      const newCartAttribute = new cartAttributeModel({
        cart: newCart._id,
        product_attribute: attr.attribute_id,
      });
      await newCartAttribute.save();
    }

    return response.status(200).json({
      status: true,
      message: "Add to Cart Success",
    });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    return response.status(500).send(error.message);
  }
};

const getCart = async (request, response) => {
  try {
    const auth = request.user;

    if (!auth) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const cartData = await cartModel
      .find({ user: auth.user._id })
      .populate(["user", "product", "shop"])
      .populate({ path: "product", populate: { path: "category" } });

    if (!cartData || cartData.length === 0) {
      return response
        .status(404)
        .json({ status: false, data: null, message: "Cart Is Empty" });
    }

    const groupedByShop = {};
    let totalPrice = 0;

    for (const item of cartData) {
      const shopId = item.shop._id.toString();

      const attributes = await cartAttributeModel
        .find({ cart: item._id })
        .populate("product_attribute");

      const itemWithAttributes = {
        ...item.toObject(),
        attributes: attributes,
      };

      const price =
        item.product.descount_price > 0
          ? item.product.descount_price
          : item.product.price;

      totalPrice += price * item.quantity;

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

const checkout = async (request, response) => {
  try {
    const auth = request.user;
    total_price = 0;
    discount_price = 0;
    if (!auth) {
      return response
        .status(400)
        .send({ status: false, message: "User Is Not Authenticated" });
    }

    const cart = await cartModel.find({ user: auth.user._id });
    if (cart.length === 0) {
      return response
        .status(404)
        .send({ status: false, message: "Cart is empty" });
    }
    for (const item of cart) {
      const product = await productModel.findOne(item.product);
      if (product.descount_price > 0) {
        total_price += product.descount_price * item.quantity;
      } else {
        total_price += product.price * item.quantity;
      }
    }
    // return response.status(400).send({ status: false, data: total_price });

    const order = new orderModel({
      user: auth.user._id,
      total_price: total_price,
      subtotal_price: total_price,
      discount: discount_price,
      address: request.body.address,
      country: request.body.country,
      city: request.body.city,
      lat: request.body.lat,
      long: request.body.long,
      phone_code: request.body.phone_code,
      phone_number: request.body.phone_number,
    });
    await order.save();
    for (const item of cart) {
      const cartAttribute = await cartAttributeModel.find({ cart: item._id });
      // return response.status(400).send({ status: false, data: cartAttribute });
      const orderProduct = new orderProductModel({
        order: order._id,
        product: item.product,
        seller: item.shop,
        quantity: item.quantity,
      });
      await orderProduct.save();

      for (const itemAttri of cartAttribute) {
        const productAttri = await productAttributeModel.findOne({
          _id: itemAttri.product_attribute,
        });
        const orderProductAttri = new orderProductAttributeModel({
          order_product: orderProduct._id,
          attribute: productAttri._id,
          color: productAttri.color_code,
          name: productAttri.name,
        });
        await orderProductAttri.save();
      }
    }

    const cartDelete = await cartModel.find({ user: auth.user._id });

    if (cartDelete && cartDelete.length > 0) {
      const cartIds = cartDelete.map((cart) => cart._id);

      await cartAttributeModel.deleteMany({ cart: { $in: cartIds } });
      await cartModel.deleteMany({ user: auth.user._id });
    }

    return response
      .status(200)
      .send({ status: true, data: null, message: "Checkout Success" });
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
  checkout,
};
