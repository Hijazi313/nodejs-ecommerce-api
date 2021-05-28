const Review = require("../models/reviewsModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = new Review({
    ...req.body,
    user: req.user._id,
    userName: req.user.fullName,
  });
  await newReview.save();

  return res.status(201).json({
    status: "OK",
    data: {
      review: newReview,
    },
  });
});
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

exports.updateReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!newReview) return next(new AppError("This Product does not exist", 404));
  return res.status(200).json({
    status: "OK",
    data: {
      review: newReview,
    },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) return next(new AppError("This Product does not exist", 404));
  return res.status(204).json({
    status: "OK",
    data: {
      review,
    },
  });
});
