const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // Removes extra spaces
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exist"], // Ensures no duplicate emails
      lowercase: true, // Converts email to lowercase
      match: [/.+@.+\..+/, "Please enter a valid email address"], // Regex validation
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "password should be 8 character long"],
      select: false,
    },
    country: {
      type: String,
      required: [true, "Country name is required"],
    },
    state: {
      type: String,
      required: [true, "State name is required"],
    },
    district: {
      type: String,
      required: [true, "District name is required"],
    },
    isVendor: {
      type: Boolean,
      default: false,
    },
    businessName: { type: String },
    contactNumber: {
      type: Number,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    console.log("error while hasing the password : " + error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

userSchema.methods.generateToken = async function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  return token;
};

const User = mongoose.model("user", userSchema);
module.exports = User;
