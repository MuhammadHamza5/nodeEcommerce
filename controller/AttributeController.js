const attributeModel = require("../models/Attribute");

const createAttribute = async (request, responce) => {
  try {
    const attribute = new attributeModel({
      name: request.body.name,
      option: request.body.option,
    });
    await attribute.save();
    return responce.status(200).send({
      status: true,
      data: attribute,
      message: "Attribute Create successfully",
    });
  } catch (error) {
    return responce.status(500).send(error.message);
  }
};
const updateAttribute = async (request, responce) => {
  try {
    const attributeId = request.body.id;
   
    await attributeModel.findByIdAndUpdate(
      { _id: attributeId },
      {
        $set: {
          name: request.body.name,
          option: request.body.option,
        },
      }
    );

    return responce.status(200).send({
      status: true,
      data: null,
      message: "Attribute Update successfully",
    });
  } catch (error) {
    return responce.status(500).send(error.message);
  }
};
const attributes = async (request, responce) => {
  try {
    const attribute = await attributeModel.find();

    return responce.status(200).send({
      status: true,
      data: attribute,
      message: "Attribute List successfully",
    });
  } catch (error) {
    return responce.status(500).send(error.message);
  }
};
const attributeById = async (request, responce) => {
  try {
    const attributeId = request.params.id;
  
    const attribute = await attributeModel.findOne({ _id: attributeId });

    return responce
      .status(200)
      .send({ status: true, data: attribute, message: "Attribute successfully" });
  } catch (error) {
    return responce.status(500).send(error.message);
  }
};
const attributeDelete = async (request, responce) => {
  try {
    const attributeId = request.body.id;
    const attribute = await attributeModel.findOne({ _id: attributeId});
    if (!attribute) {
        return responce.status(404).send({ status: false,data:null, message: "Attribute not found" });
    }
    await attributeModel.findByIdAndDelete({ _id: attributeId });



    return responce.status(200).send({
      status: true,
      data: null,
      message: "Attribute Delete successfully",
    });
  } catch (error) {
    return responce.status(500).send(error.message);
  }
};

module.exports = {
    createAttribute,
    updateAttribute,
    attributes,
    attributeById,
    attributeDelete,
};
