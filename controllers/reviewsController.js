const Review = require("../models/reviewsModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { deleteOne, updateOne, createOne } = require("./handlerFactory");

exports.setReviewBody = catchAsync(async (req, res, next) => {
  const body = { ...req.body, user: req.user._id, userName: req.user.fullName };
  req.body = body;
  next();
});

exports.createReview = createOne(Review);
exports.readReview = catchAsync(async (req, res, next) => {});
exports.readAllReview = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  return res.status(200).json({
    status: "OK",
    data: {
      reviews,
    },
  });
});

exports.updateReview = updateOne(Review);

exports.deleteReview = deleteOne(Review);
