import { v2 as cloudinary } from "cloudinary";

const uploadImage = (url: string) => {
  return cloudinary.uploader.upload(url, {
    folder: "coffee",
  });
};

export default uploadImage;
