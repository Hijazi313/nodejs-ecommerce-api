const catchAsync = require("../utils/catchAsync");

exports.myProfile = catchAsync(async (req, res, next) => {
  const user = req.user;
  return res.status(200).json({ status: "OK", user });
});
