const AppError = require("../utils/appError");

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDb = (err) => {
  const key = Object.keys(err.keyValue)[0];
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate field ${key}: ${value}.`;
  return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProduction = (err, res) => {
  // Operational error, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming error or other unknown error: dont't leak error details
  } else {
    // 1) Log error to the Server
    console.error(`ERROR : ${err}`);

    // 2) Send a generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.name === "CastError" || error.kind === "ObjectId")
      error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateFieldsDb(error, res);
    sendErrorProduction(error, res);
  } else {
    sendErrorDev(err, res);
  }
};
