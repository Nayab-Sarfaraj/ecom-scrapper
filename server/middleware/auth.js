const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Errorhandler = require("../utils/errorHandler");
// const Errorhandler = require("../utils/errorHandler");
const isAuthenticated = async function (req, res, next) {
  try {
    const token = req.cookies.token;
    console.log("Token:", token);
    if (!token)
      return next(new Errorhandler("Please login to access resources", 401));
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedData);
    const user = await User.findById(decodedData.id);
    if (!user) return next(new Errorhandler("You are not authorized", 401));
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    console.log("ERROR WHILE AUTHENTICATING THE USER");
    console.log(error.message);
  }
};

const authorizeRole = async (req, res, next) => {
  try {
    if (!req.user)
      return next(
        new Errorhandler("You are not authorized to access this resource", 401)
      );
    if (!req.user.isVendor)
      return next(
        new Errorhandler("You are not authorized to access this resource", 401)
      );
    next();
  } catch (error) {
    console.log("ERROR WHILE AUTHENTICATING THE ROLE");
    console.log(error.message);
    return next(new Errorhandler("Something went wrong", 500));
  }
};

module.exports = { isAuthenticated, authorizeRole };
