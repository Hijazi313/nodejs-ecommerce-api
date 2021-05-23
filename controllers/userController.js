const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

exports.myProfile = catchAsync(async (req, res, next) => {
  const user = req.user;
  return res.status(200).json({ status: "OK", user });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  return res.status(204).json({
    status: "OK",
    data: null,
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  return res.status(200).json({
    status: "OK",
    users,
  });
});
