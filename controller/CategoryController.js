const categoryModel = require("../models/Category");

const createCategory = async (request, responce) => {
  try {
    const category = new categoryModel({
      name: request.body.name,
      description: request.body.description,
    });
    await category.save();
    return responce.status(200).send({
      status: true,
      data: category,
      message: "Category Create successfully",
    });
  } catch (error) {
    return responce.status(500).send(error.message);
  }
};
const updateCategory = async (request, responce) => {
  try {
    const categoryId = request.body.id;
   
    await categoryModel.findByIdAndUpdate(
      { _id: categoryId },
      {
        $set: {
          name: request.body.name,
          description: request.body.description,
        },
      }
    );

    return responce.status(200).send({
      status: true,
      data: null,
      message: "Category Update successfully",
    });
  } catch (error) {
    return responce.status(500).send(error.message);
  }
};
const categories = async (request, responce) => {
  try {
    const category = await categoryModel.find();

    return responce.status(200).send({
      status: true,
      data: category,
      message: "Categories List successfully",
    });
  } catch (error) {
    return responce.status(500).send(error.message);
  }
};
const categoryById = async (request, responce) => {
  try {
    const categoryId = request.params.id;
    const category = await categoryModel.findOne({ _id: categoryId });

    return responce
      .status(200)
      .send({ status: true, data: category, message: "Category successfully" });
  } catch (error) {
    return responce.status(500).send(error.message);
  }
};
const categoryDelete = async (request, responce) => {
  try {
    const categoryId = request.body.id;
    const category = await categoryModel.findByIdAndDelete({ _id: categoryId });

    return responce.status(200).send({
      status: true,
      data: null,
      message: "Category Delete successfully",
    });
  } catch (error) {
    return responce.status(500).send(error.message);
  }
};

module.exports = {
  createCategory,
  updateCategory,
  categories,
  categoryById,
  categoryDelete,
};
