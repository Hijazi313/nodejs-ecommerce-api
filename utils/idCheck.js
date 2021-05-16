const { isValidObjectId } = require("mongoose");
const AppError = require("./appError");

module.exports = function (req, res, next) {
  if (isValidObjectId(req.params.id)) {
    return next();
  } else {
    return next(new AppError("Please give a valid ObjectId", 400));
  }
};
