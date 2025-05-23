export const validateFile = (file, allowedTypes, maxSize) => {
  if (!file) {
    throw new Error("No file uploaded");
  }

  const { mimetype, size } = file;

  if (!allowedTypes.includes(mimetype)) {
    throw new Error(
      `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
    );
  }

  if (size > maxSize) {
    throw new Error(
      `File size exceeds the limit of ${maxSize / (1024 * 1024)} MB`,
    );
  }
};

export const uploadToCloudinary = async (file) => {
  try {
    if (!file) {
      throw new Error("No file uploaded");
    }

    console.log("Uploading file to Cloudinary:", JSON.stringify(file, null, 2));

    if (!file.path) {
      throw new Error("File path is missing");
    }

    console.log("File uploaded to Cloudinary:", file.path);

    return file.path;
  } catch (error) {
    console.error("Error in uploadImageToCloudinary:", error.message);
    throw error;
  }
};

