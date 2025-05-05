const productModel = require("../models/Product");
const sellerDataModel = require("../models/SellerData");


const productCreate = async (request, responce) => {
  try {

    const auth =  request.user;

    if(auth){
        const seller = await sellerDataModel.findOne({user_id: auth.user._id});
        if(seller){
            const product = new productModel({
                name:request.body.name ,
                description:request.body.description ,
                price:request.body.price ,
                descount_price:request.body.descount_price ,
                stock:request.body.stock ,
                seller_id:seller._id ,
              });
              await product.save();

              return responce.status(200).send({status:true,data:product, message:"Product created successfully"});
        }
    }else{
        return responce
        .status(200)
        .send({ status: true, data: null, message: "User is Not Authenticate" });
    }

   
  } catch (error) {
    return responce.status(500).send(error.message);
  }
};

const productUpdate = async (request, responce) => {
    try {
  
      const auth =  request.user;
      const productId = request.body.id;
  
      if(auth){
          const seller = await sellerDataModel.findOne({user_id: auth.user._id});
          if(seller){

            const checkProduct = await productModel.findOne({seller_id:seller._id,_id:productId});
            if(!checkProduct){
                return responce.status(400).send({status:false,data:null, message:"Product Not Found"});

            }

            const product = await productModel.findByIdAndUpdate({_id:productId},{$set:{
                name:request.body.name ,
                description:request.body.description ,
                price:request.body.price ,
                descount_price:request.body.descount_price ,
                stock:request.body.stock ,
            }})

            return responce.status(200).send({status:true,data:product, message:"Product Update successfully"});
          }
      }else{
          return responce
          .status(200)
          .send({ status: true, data: null, message: "User is Not Authenticate" });
      }
  
     
    } catch (error) {
      return responce.status(500).send(error.message);
    }
  };
  const products = async (request, responce) => {
    try {
  
      const auth =  request.user;
  
      if(auth){
          const seller = await sellerDataModel.findOne({user_id: auth.user._id});
          if(seller){

            const products = await productModel.find({seller_id:seller._id});
            


            return responce.status(200).send({status:true,data:products, message:"Product Update successfully"});
          }
      }else{
          return responce
          .status(200)
          .send({ status: true, data: null, message: "User is Not Authenticate" });
      }
  
     
    } catch (error) {
      return responce.status(500).send(error.message);
    }
  };

module.exports = {
    productCreate,
    productUpdate,
    products,
}
