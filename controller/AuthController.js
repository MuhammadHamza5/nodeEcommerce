const user = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const nodeMailer = require("nodemailer");
const otpVerification = require("../models/OtpVerification");

const passwordDcrypt = async (password) => {
  try {
    const passwordHash = await bcryptjs.hash(password, 10);
    return passwordHash;
  } catch (error) {
    response.status(400).send(error.message);
  }
};

const tokenFun = async (user) => {
  try {
    const token = await jwt.sign({ user: user }, config.jwt_key);
    return token;
  } catch (error) {
    response.status(400).send(error.message);
  }
};

const sendMailOtp = async (userDetail , otp) => {
  try {

    const transporter = nodeMailer.createTransport({
      host: config.MAIL_HOST,
      port: config.MAIL_PORT,
      secure: true,
      requireTLS: config.TLS,
      auth: {
        user: config.MAIL_USERNAME,
        pass: config.MAIL_PASSWORD,
      },
    });

    const mailOption = {
      from: config.MAIL_USERNAME,
      to: userDetail.email,
      subject: "Your OTP Code",
      html: `<p>Your OTP code is <b>${otp}</b></p>`,
    };

    
    
    await transporter.sendMail(mailOption);
    console.log("OTP sent to email:", userDetail.email);
    return otp;
  } catch (error) {
    console.error("Failed to send email:", error.message);
    throw error;
  }
};

const register = async (request, responce) => {
  try {
    const passwordHash = await passwordDcrypt(request.body.password);
    const checkEmil = await user.findOne({ email: request.body.email });
    if (checkEmil) {
      responce
        .status(400)
        .send({ success: false, data: null, message: "Email Already Exist" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);

    
    const createUser = new user({
      first_name: request.body.first_name,
      last_name: request.body.last_name,
      email: request.body.email,
      password: passwordHash,
      image: request.file ? `/user/${request.file.filename}` : null,
    });
    await createUser.save();
    const OtpVerification = new otpVerification({
      user_id: createUser._id,
      code: otp,
      status_reg: 0,
      status_pass_res: 0,
    });
    await OtpVerification.save();
    await sendMailOtp(createUser , OtpVerification.code);
    responce.status(200).send({
      success: true,
      data: createUser,
      message: "User registered successfully",
    });
  } catch (error) {
    responce.status(400).send(error.message);
  }
};

const login = async (request, responce) => {
  const email = request.body.email;
  const password = request.body.password;
  const otp = Math.floor(100000 + Math.random() * 900000);
  const userData = await user.findOne({ email: email });

  if (userData) {
    const matchPas = await bcryptjs.compare(password, userData.password);
    if (matchPas) {
      if(userData.email_verified_at == null){

        const otpCode = await otpVerification.findOne({user_id:userData._id});
        
        if(otpCode){
          await otpVerification.findOneAndUpdate({user_id:userData._id},{$set:{
            code : otp
          }});
          await sendMailOtp(userData ,otp);
  
          return responce
          .status(400)
          .send({ status: false, data: null, message: "Please verify your otp" });
        }else{
          

          const OtpVerification = new otpVerification({
            user_id: userData._id,
            code: otp,
            status_reg: 0,
            status_pass_res: 0,
          });
          OtpVerification.save();
           await sendMailOtp(userData ,OtpVerification.code);
          return responce
          .status(400)
          .send({ status: false, data: null, message: "Please verify your otp" });
        }
       
      }
      const token = await tokenFun(userData);

      const userObj = userData.toObject();
      userObj.token = token;
      responce
        .status(200)
        .send({ status: true, data: userObj, message: "Login Success" });
    } else {
      responce
        .status(400)
        .send({ status: false, data: null, message: "Invalide Password" });
    }
  } else {
    responce
      .status(400)
      .send({ status: false, data: null, message: "Email Not Exist" });
  }
};
const updatePassword = async (request, responce) => {
  try {
    const authUser = request.user;

    const oldPassword = request.body.old_password;
    const newPassword = request.body.new_password;

    const checkPassword = await bcryptjs.compare(
      oldPassword,
      authUser.user.password
    );

    const passwordHash = await passwordDcrypt(newPassword);

    if (checkPassword) {
      await user.findByIdAndUpdate(
        { _id: authUser.user._id },
        {
          $set: {
            password: passwordHash,
          },
        }
      );
      return responce.status(200).send({
        status: true,
        data: authUser,
        message: "Password Update Success",
      });
    } else {
      return responce
        .status(400)
        .send({ status: true, data: null, message: "In Currect Password" });
    }
  } catch (error) {
    responce.status(400).send(error.message);
  }
};

const updateProfile = async (request, responce) => {
  try {
    const authUser = request.user;
   
    await user.findByIdAndUpdate(
      { _id: authUser.user._id },
      {
        $set: {
          first_name: request.body.first_name ?? checkUser.first_name,
          last_name: request.body.last_name ?? checkUser.last_name,
        },
      }
    );

    const updateUser = await user.findOne({ _id: authUser.user._id });

    return responce.status(200).send({
      status: true,
      data: updateUser,
      message: "Profile Update Success",
    });
  } catch (error) {
    responce.status(400).send(error.message);
  }
};
const getProfile = async (request, response) => {
  try {
    const authUser = request.user;

    const userProfile = await user.findOne({ _id: authUser.user._id });
    // const userProfile = await user.findOne({ _id: request.body.id });

    if (!userProfile) {
      return response.status(404).send({
        status: false,
        data: null,
        message: "User not found",
      });
    }

    return response.status(200).send({
      status: true,
      data: userProfile,
      message: "User Profile Success",
    });
  } catch (error) {
    response.status(400).send({ status: false, message: error.message });
  }
};

const resetPassword = async (request, response) => {
  try {
    const email = request.body.email;
    const userData = await user.findOne({ email: email });
    await sendMailOtp(userData);
    return response.status(200).send({
      status: true,
      data: userData,
      message: "Send Otp Your Email",
    });
  } catch (error) {
    response.status(400).send({ status: false, message: error.message });
  }
};
const verifyOtp = async (request, response) => {
  try {
    const email = request.body.email;
    const code = request.body.code;
    const type = request.body.type;
    //type 1 reset pass 2 registerd otp verify
    const userData = await user.findOne({email:email});
    if(userData){
      const verifyCode = await otpVerification.findOne({ code: code , user_id : userData._id });
      if(verifyCode){
       
          await user.findByIdAndUpdate(
            { _id: verifyCode.user_id },
            {
              $set: {
                email_verified_at: new Date(),
              },
            }
          );
          await otpVerification.findByIdAndDelete(verifyCode._id);
          return response.status(200).send({
            status: true,
            data: userData,
            message: "Otp Verify",
          });
      }else{
        return response.status(400).send({
          status: false,
          data: null,
          message: "Otp Not Found",
        });
      }
    }

    
  } catch (error) {
    response.status(400).send({ status: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  updatePassword,
  updateProfile,
  getProfile,
  resetPassword,
  verifyOtp,
};
