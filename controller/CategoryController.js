const categoryModel = require("../models/Category");
// const categoryAttributeModel = require("../models/CategoryAttribute");

const createCategory = async (request, response) => {
  try {
    const category = new categoryModel({
      name: request.body.name,
      description: request.body.description,
      attribute: request.body.attribute_id,
    });
    await category.save();
    return response.status(200).send({
      status: true,
      data: category,
      message: "Category Create successfully",
    });
  } catch (error) {
    return response.status(500).send(error.message);
  }
};
const updateCategory = async (request, response) => {
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

    return response.status(200).send({
      status: true,
      data: null,
      message: "Category Update successfully",
    });
  } catch (error) {
    return response.status(500).send(error.message);
  }
};
const categories = async (request, response) => {
  try {
    const category = await categoryModel.find().populate("attribute");
    // const categories = await categoryModel.find();

    // const results = await Promise.all(categories.map(async (cat) => {
    //   const links = await categoryAttributeModel.find({ category_id: cat._id }).populate("attribute_id");
    //   return {
    //     ...cat.toObject(),
    //     attributes: links.map(link => link.attribute_id)
    //   };
    // }));

    //    const res = [];
    // const oldres= [];
    // const updateres = [...oldres , ...res]

    return response.status(200).send({
      status: true,
      data: category,
      message: "Categories List successfully",
    });
  } catch (error) {
    return response.status(500).send(error.message);
  }
};
const categoryById = async (request, response) => {
  try {
    const categoryId = request.params.id;
    const category = await categoryModel
      .findOne({ _id: categoryId })
      .populate("attribute");

    return response
      .status(200)
      .send({ status: true, data: category, message: "Category successfully" });
  } catch (error) {
    return response.status(500).send(error.message);
  }
};
const categoryDelete = async (request, response) => {
  try {
    const categoryId = request.body.id;
    const category = await categoryModel.findByIdAndDelete({ _id: categoryId });

    return response.status(200).send({
      status: true,
      data: null,
      message: "Category Delete successfully",
    });
  } catch (error) {
    return response.status(500).send(error.message);
  }
};
const categoryAttributeLink = async (request, response) => {
  try {
    const categoryId = request.body.category_id;
    const attributeIds = request.body.attribute_id;
    const category = await categoryModel.findOne({ _id: categoryId });
    if (!category) {
      return response
        .status(404)
        .send({ status: false, data: null, message: "category not found" });
    }

    await categoryModel.findByIdAndUpdate(
      { _id: category._id },
      {
        $set: {
          attribute: attributeIds,
        },
      }
    );

    return response.status(200).send({
      status: true,
      data: null,
      message: "Category Attribute Link successfully",
    });
  } catch (error) {
    return response.status(500).send(error.message);
  }
};

module.exports = {
  createCategory,
  updateCategory,
  categories,
  categoryById,
  categoryDelete,
  categoryAttributeLink,
};
