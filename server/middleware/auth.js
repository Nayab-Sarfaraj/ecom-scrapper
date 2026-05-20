const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Errorhandler = require("../utils/errorHandler");

const isAuthenticated = async function (req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token)
      return next(new Errorhandler("Please login to access resources", 401));

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedData.id);
    if (!user)
      return next(new Errorhandler("User not found. Please login again.", 401));

    req.user = user;
    next();
  } catch (error) {
    // jwt.verify throws for expired / tampered tokens — pass to error handler
    if (error.name === "TokenExpiredError")
      return next(new Errorhandler("Session expired. Please login again.", 401));
    if (error.name === "JsonWebTokenError")
      return next(new Errorhandler("Invalid token. Please login again.", 401));
    return next(new Errorhandler("Authentication failed.", 401));
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
        new Errorhandler("Only vendor accounts can access this resource", 403)
      );
    next();
  } catch (error) {
    return next(new Errorhandler("Authorization failed.", 500));
  }
};

module.exports = { isAuthenticated, authorizeRole };
