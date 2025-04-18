import httpStatus from "http-status";

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const throwBadRequest = (condition, message) => {
  if (condition) {
    throw new ApiError(httpStatus.BAD_REQUEST, message);
  }
};
