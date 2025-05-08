const productModel = require("../models/Product");
const sellerDataModel = require("../models/SellerData");
const categoryModel = require("../models/Category");
const productAttributeModel = require("../models/ProductAttribute");
const attributeModel = require("../models/Attribute");

const productCreate = async (request, response) => {
  try {
    const auth = request.user;
    const categoryId = request.body.category_id;
    const productAttributes = request.body.product_attribute;

    if (auth) {
      const seller = await sellerDataModel.findOne({ user_id: auth.user._id });
      if (seller) {
        const category = await categoryModel.findOne({ _id: categoryId });
        if (!category) {
          return response
            .status(404)
            .send({ status: false, data: null, message: "category not found" });
        }

        const product = new productModel({
          name: request.body.name,
          description: request.body.description,
          price: request.body.price,
          descount_price: request.body.descount_price,
          stock: request.body.stock,
          status: request.body.status ?? 1,
          seller: seller._id,
          category: category._id,
        });
        await product.save();

        for (const productAttribute of productAttributes) {
          const attribute = await attributeModel.findOne({
            _id: productAttribute.attribute_id,
          });
          if (!attribute) {
            return response.status(404).send({
              status: false,
              data: null,
              message: "attribute not found",
            });
          }
          const productAttributeData = new productAttributeModel({
            product: product._id,
            attribute: productAttribute.attribute_id,
            name: productAttribute.name,
            price: productAttribute.price ?? 0,
            quantity: productAttribute.quantity ?? 0,
            color_code: productAttribute.color_code,
          });
          await productAttributeData.save();
        }

        return response.status(200).send({
          status: true,
          data: product,
          message: "Product created successfully",
        });
      }
    } else {
      return response.status(200).send({
        status: true,
        data: null,
        message: "User is Not Authenticate",
      });
    }
  } catch (error) {
    return response.status(500).send(error.message);
  }
};

const productUpdate = async (request, response) => {
  try {
    const auth = request.user;
    const productId = request.body.id;

    if (auth) {
      const seller = await sellerDataModel.findOne({ user_id: auth.user._id });
      if (seller) {
        const checkProduct = await productModel.findOne({
          seller_id: seller._id,
          _id: productId,
        });
        if (!checkProduct) {
          return response
            .status(400)
            .send({ status: false, data: null, message: "Product Not Found" });
        }

        const product = await productModel.findByIdAndUpdate(
          { _id: productId },
          {
            $set: {
              name: request.body.name,
              description: request.body.description,
              price: request.body.price,
              descount_price: request.body.descount_price,
              stock: request.body.stock,
            },
          }
        );

        return response.status(200).send({
          status: true,
          data: product,
          message: "Product Update successfully",
        });
      }
    } else {
      return response.status(200).send({
        status: true,
        data: null,
        message: "User is Not Authenticate",
      });
    }
  } catch (error) {
    return response.status(500).send(error.message);
  }
};
const products = async (request, response) => {
  try {
    const auth = request.user;
    const productsWithAttributes = [];
    if (auth) {
      const seller = await sellerDataModel.findOne({ user_id: auth.user._id });
      if (seller) {
        const products = await productModel.find({ seller: seller._id }).populate(['category','seller']);

        for(const product of products){
          const productAttri = await productAttributeModel.find({product:product._id}).populate(['attribute']);
          const productObj = product.toObject();
          productObj.productAttribute = productAttri;
          productsWithAttributes.push(productObj);


        }

        return response.status(200).send({
          status: true,
          data: productsWithAttributes,
          message: "Product List successfully",
        });
      }
    } else {
      return response.status(200).send({
        status: true,
        data: null,
        message: "User is Not Authenticate",
      });
    }
  } catch (error) {
    return response.status(500).send(error.message);
  }
};

module.exports = {
  productCreate,
  productUpdate,
  products,
};
