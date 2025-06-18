const favouriteModel = require("../models/Favourite");
const productModel = require("../models/Product");
const addRemoveFavourite = async (request, response) => {
  try {
    const auth = request.user;
    const productId = request.body.product_id;

    if (!auth) {
      return response.status(401).json({ message: "User is not authorized" });
    }

    const checkProduct = await productModel.findById(productId);
    if (!checkProduct) {
      return response.status(404).json({ message: "Product not found" });
    }

    const checkFavourite = await favouriteModel.findOne({
      user: auth.user._id,
      product: productId,
    });

    if (checkFavourite) {
      await favouriteModel.findByIdAndDelete(checkFavourite._id);
      return response.status(200).json({
        status: true,
        data: null,
        message: "Product removed from favourite list",
      });
    }

    const favourite = new favouriteModel({
      user: auth.user._id,
      product: productId,
    });

    await favourite.save();
    return response.status(200).json({
      status: true,
      data: null,
      message: "Product added to favourite list",
    });

  } catch (error) {
    return response.status(500).send({ status: false, message: error.message });
  }
};


module.exports = {
  addRemoveFavourite,
};
