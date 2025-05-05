const jwt = require("jsonwebtoken");
const config = require("../config/config");

const checkValidToken = async (request, responce, next) => {
  const token =
    request.body.token ||
    request.query.token ||
    request.headers["authorization"];
  if (!token) {
    responce.status(400).send({ message: "User is not authenticate" });
  }
  try {
    const checkToken = await jwt.verify(token, config.jwt_key);
    request.user = checkToken;
  } catch (error) {
    responce.status(400).send({ message: "Token is not valide" });
  }
  return next();
};

module.exports = checkValidToken;
