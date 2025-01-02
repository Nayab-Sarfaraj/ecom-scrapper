const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connection successful");
  } catch (error) {
    console.log(error);
    console.log("ERROR WHILE CONNECTING TO DATABASE");
    process.exit(1);
  }
};
module.exports = connectToDB;
