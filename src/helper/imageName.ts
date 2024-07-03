import { createCustomError } from "../utils/customError";

const getImageName = async (filePath) => {
  try {
    const parts = filePath.split("/");

    // Finding the index of 'image'
    const indexOfImage = parts.indexOf("image");

    // Extracting the base URL and the 'image' part
    const baseUrl = parts.slice(0, indexOfImage + 2).join("/");
    let imagePart = parts.slice(indexOfImage, parts.length).join("/");

    // Remove leading '/'
    if (imagePart.startsWith("/")) {
      imagePart = imagePart.substring(1);
    }
    return imagePart;
  } catch (error) {
    throw createCustomError(error);
  }
};

export default getImageName;
