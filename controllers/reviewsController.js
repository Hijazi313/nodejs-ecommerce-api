const Review = require("../models/reviewsModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { deleteOne, updateOne, createOne, getAll } = require("./handlerFactory");

exports.setReviewBody = catchAsync(async (req, res, next) => {
  const body = { ...req.body, user: req.user._id, userName: req.user.fullName };
  req.body = body;
  next();
});

exports.createReview = createOne(Review);

// TODO: Make it to work with only one product
exports.readAllReview = getAll(Review);

exports.updateReview = updateOne(Review);

exports.deleteReview = deleteOne(Review);
