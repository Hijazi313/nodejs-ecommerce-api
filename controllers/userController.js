const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const { updateOne } = require("./handlerFactory");

const filterObj = (obj, ...allowedFields) => {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
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

exports.updateMe = catchAsync(async (req, res, next) => {
  // It will allow user to update its name and email only
  // 1) Throw Error if User tries to update password
  if (req.body.password) {
    return next(new AppError("This Route is not for password updates", 400));
  }

  // 2) Filtered out unwanteds field names, that are not allowed to be updated;

  const filteredBody = filterObj(req.body, "fullName", "email");
  // 3) Update User Document
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    status: "OK",
    data: { user: updatedUser },
  });
});

// TODO: make a route, only for admmin access
// DO not change or update password with this
exports.updateUser = updateOne(User);
