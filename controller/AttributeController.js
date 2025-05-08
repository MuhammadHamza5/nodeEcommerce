const attributeModel = require("../models/Attribute");
const categoryModel = require("../models/Category");
const categoryAttributeModel = require("../models/CategoryAttribute");

const createAttribute = async (request, response) => {
  try {
    const attribute = new attributeModel({
      name: request.body.name,
      option: request.body.option,
      option_code: request.body.option_code,
    });
    await attribute.save();
    return response.status(200).send({
      status: true,
      data: attribute,
      message: "Attribute Create successfully",
    });
  } catch (error) {
    return response.status(500).send(error.message);
  }
};
const updateAttribute = async (request, response) => {
  try {
    const attributeId = request.body.id;

    await attributeModel.findByIdAndUpdate(
      { _id: attributeId },
      {
        $set: {
          name: request.body.name,
          option: request.body.option,
          option_code: request.body.option_code,
        },
      }
    );

    return response.status(200).send({
      status: true,
      data: null,
      message: "Attribute Update successfully",
    });
  } catch (error) {
    return response.status(500).send(error.message);
  }
};
const attributes = async (request, response) => {
  try {
    const attributeList = await attributeModel.find();

    // Optional: parse the option field
    // const parsedAttributes = attributeList.map((attr) => ({
    //   ...attr.toObject(),
    //   option: JSON.parse(attr.option),
    // }));

    return response.status(200).send({
      status: true,
      data: attributeList, // Send parsed data
      message: "Attribute List successfully",
    });
  } catch (error) {
    return response.status(500).send(error.message);
  }
};
const attributeById = async (request, response) => {
  try {
    const attributeId = request.params.id;

    const attribute = await attributeModel.findOne({ _id: attributeId });

    return response
      .status(200)
      .send({
        status: true,
        data: attribute,
        message: "Attribute successfully",
      });
  } catch (error) {
    return response.status(500).send(error.message);
  }
};
const attributeDelete = async (request, response) => {
  try {
    const attributeId = request.body.id;
    const attribute = await attributeModel.findOne({ _id: attributeId });
    if (!attribute) {
      return response
        .status(404)
        .send({ status: false, data: null, message: "Attribute not found" });
    }
    await attributeModel.findByIdAndDelete({ _id: attributeId });

    return response.status(200).send({
      status: true,
      data: null,
      message: "Attribute Delete successfully",
    });
  } catch (error) {
    return response.status(500).send(error.message);
  }
};

module.exports = {
  createAttribute,
  updateAttribute,
  attributes,
  attributeById,
  attributeDelete,
};
