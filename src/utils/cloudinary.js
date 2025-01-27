
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { configDotenv } from "dotenv";
configDotenv({
  path: ".env",
});

// Configuration
cloudinary.config({
  cloud_name: "djfcluzpm",
  api_key: "755581532749259",
  api_secret: process.env.API_SECRET_KEY,
});
 const uploadFileToCloundinary = async (filePath) => {
  try {
    if (!filePath) return null;
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    console.log("File upload complete", response.url);

    fs.unlinkSync(filePath);

    return response.url
  } catch (error) {
    console.log(error);
    fs.unlinkSync(filePath);
    return null;
  }
};

export default uploadFileToCloundinary;
