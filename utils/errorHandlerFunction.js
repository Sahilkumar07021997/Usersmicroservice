function errorHandler(res, message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  Error.captureStackTrace(error, errorHandler);

  res.status(statusCode).json({
    success: false,
    message: message,
  });

  return error;
}

module.exports = errorHandler;
