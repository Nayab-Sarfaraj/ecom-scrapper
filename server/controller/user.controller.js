const User = require("../models/user.model");
const Errorhandler = require("../utils/errorHandler");
const saveToken = require("../utils/jwtToken");
const bcrypt = require("bcrypt");
const sendMail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const register = async (req, res, next) => {
  try {
    const {
      email,
      name,
      password,
      country,
      state,
      district,
      contactNumber,
      businessName,
    } = req.body;
    console.log(req.body);
    if (!email) return next(new Errorhandler("email is reuired", 401));
    if (!name) return next(new Errorhandler("name is rquired ", 401));
    if (!password) return next(new Errorhandler("password is required", 401));
    if (!country) return next(new Errorhandler("password is required", 401));
    if (!state) return next(new Errorhandler("password is required", 401));
    if (!district) return next(new Errorhandler("password is required", 401));
    if (contactNumber && !/^\d{10,15}$/.test(Number(contactNumber))) {
      return next(
        new Errorhandler(
          "Please enter a valid contact number (10-15 digits)",
          401
        )
      );
    }

    // Business type validation for vendors
    if (req.body?.isVendor) {
      if (!req.body?.businessName) {
        return next(
          new Errorhandler("Business name is required for vendors", 401)
        );
      }
    }
    const isExits = await User.findOne({ email: email });
    if (isExits) return next(new Errorhandler("User already exist ", 401));
    const newUser = new User({
      email,
      password,
      name,
      country: country.toLowerCase(),
      district: district.toLowerCase(),
      state: state.toLowerCase(),
      isVendor: req.body.isVendor ? req.body.isVendor : false,
      businessName: req.body?.businessName || "",
      contactNumber: req.body?.contactNumber,
    });
    const savedUser = await newUser.save();
    return res.status(200).json({
      success: true,
      user: savedUser,
    });
  } catch (error) {
    console.log(error.message);
    console.log("Error while registering the use");
    return next(new Errorhandler("Something went wrong", 500));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email) return next(new Errorhandler("email is reuired", 401));
    if (!password) return next(new Errorhandler("password is required", 401));
    const user = await User.findOne({ email: email }).select("+password");
    // console.log(user);
    if (!user) return next(new Errorhandler("Invalid email or password", 401));
    const result = await user.comparePassword(password);
    console.log(result);
    if (!result)
      return next(new Errorhandler("Invalid email or password", 400));
    saveToken(user, res, 200);
  } catch (error) {
    console.log(error.message);
    console.log("Error while logging the use");
    return next(new Errorhandler("Something went wrong", 500));
  }
};

const getUserData = async (req, res, next) => {
  try {
    const id = req.user._id;
    const user = await User.findById(id);
    if (!user) return next(new Errorhandler("Please login ", 401));
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    return next(new Errorhandler("Something went wrong", 500));
  }
};

const logout = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 400));
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findOne({ email: req.user.email }).select(
      "+password"
    );
    if (!user)
      return next(new Errorhandler("Please login to update the password", 401));
    const isMatching = await bcrypt.compare(oldPassword, user.password);
    if (!isMatching)
      return next(new Errorhandler("Passwords doesnt match", 401));
    user.password = newPassword;
    const updatedUser = await user.save();
    return res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log(error);
    return next(new Errorhandler("Something went wrong", 500));
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return next(new Errorhandler("Invalid email does not exist", 401));
    const response = await sendMail(email, user._id);
    console.log(response);
    return res.json({ success: true, message: "sent message successfully" });
  } catch (error) {
    console.log(error);
    return next(new Errorhandler("Something went wrong", 500));
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    const { password } = req.body;

    const { userId } = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId).select("+password");
    if (!user) return next(new Errorhandler("Token expired", 401));
    user.password = password;
    const updatedUser = await user.save();
    return res.json({ success: true, user: updatedUser });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
};

module.exports = {
  register,
  login,
  getUserData,
  logout,
  updatePassword,
  forgotPassword,
  resetPassword,
};
