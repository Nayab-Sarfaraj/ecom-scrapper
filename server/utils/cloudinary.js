const v2 = require("cloudinary");
const fs = require("fs");

v2.config({
  cloud_name: "dqeogl7bs",
  api_key: "324493841796829",
  api_secret: "_3_hFO5WLaTYISX53Jt4REF1Wn0",
});

const uploadOnCloudinary = async function (localPath) {
  try {
    const response = await v2.uploader.upload(localPath, {
      resource_type: "auto",
    });

    console.log("Upload successful:", response);

    // Delete the local file
    await fs.promises.unlink(localPath);
    console.log("File deleted from local server successfully");

    return response; // Return the Cloudinary response
  } catch (error) {
    console.error("Error during Cloudinary upload:", error);

    // Attempt to delete the local file in case of an error
    try {
      await fs.promises.unlink(localPath);
      console.log("File deleted from local server after upload failure");
    } catch (unlinkError) {
      console.error("Failed to delete local file:", unlinkError);
    }

    throw error; // Re-throw the error for the calling function to handle
  }
};











module.exports = uploadOnCloudinary;
