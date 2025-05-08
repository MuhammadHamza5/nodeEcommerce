const userData = require('../models/User');
const sellerData = require('../models/SellerData');

const createSellerShop = async(request,response) => {
    try {

        const auth = request.user;

        const sellerShop = new  sellerData({
            shop_name:request.body.shop_name,
            address:request.body.address,
            zip_code:request.body.zip_code,
            city:request.body.city,
            country:request.body.country,
            lat:request.body.lat,
            long:request.body.long,
            description:request.body.description,
            user_id:auth.user._id
        });
        sellerShop.save();

        return response
        .status(200)
        .send({ status: true, data: sellerShop, message: "Seller Shop Create Success" });

        
    } catch (error) {
        response.status(400).send(error.message);
    }
}

const updateSellerShop = async(request,response) => {
    try {

        const auth = request.user;
        const checkSeller = await sellerData.findOne({user_id:auth.user._id});
        if(!checkSeller){
            return response
            .status(400)
            .send({ status: false, data: sellerShop, message: "Seller Shop Not Found" });
        }
      

        await sellerData.findByIdAndUpdate({_id:checkSeller._id},{$set:{
            shop_name:request.body.shop_name ?? checkSeller.shop_name,
            address:request.body.address ?? checkSeller.address,
            zip_code:request.body.zip_code ?? checkSeller.zip_code,
            city:request.body.city ?? checkSeller.city,
            country:request.body.country ?? checkSeller.country,
            lat:request.body.lat ?? checkSeller.lat,
            long:request.body.long ?? checkSeller.long,
            description:request.body.description ?? checkSeller.description,
        }});

        
        return response
        .status(200)
        .send({ status: true, data: checkSeller, message: "Seller Shop Update Success" });

        
    } catch (error) {
        response.status(400).send(error.message);
    }
}

const getSellerShop = async(request,response) => {
    try {

        const auth = request.user;
        const checkSeller = await sellerData.findOne({user_id:auth.user._id}).populate('user_id');

        if(!checkSeller){
            return response
            .status(400)
            .send({ status: false, data: null, message: "Seller Shop Not Found" });
        }
      


        
        return response
        .status(200)
        .send({ status: true, data: checkSeller, message: "Seller Shop Update Success" });

        
    } catch (error) {
        response.status(400).send(error.message);
    }
}


module.exports  = {
    createSellerShop,
    updateSellerShop,
    getSellerShop,
}