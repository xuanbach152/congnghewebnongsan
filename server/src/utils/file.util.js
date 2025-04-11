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
