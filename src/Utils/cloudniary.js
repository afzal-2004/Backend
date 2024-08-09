import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadResult = async (localFilePath) => {
  try {
    if (!localFilePath)
      // CheckCondiction if File is not Exist then return Null
      return null;
    //Upload  THE File On cloudNiary
    const responce = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log(" File Has been Uploaded  on cloudNiary SuccesFully");
    fs.unlinkSync(localFilePath);
    return responce;
  } catch (error) {
    // Remove all Temprary local  saved File
    fs.unlinkSync(localFilePath);
    return null;
  }
};
export { uploadResult };
