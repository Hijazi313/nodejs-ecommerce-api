const { promisify } = require("util");
const { verify } = require("jsonwebtoken");

const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const signToken = require("../utils/signToken");

// USER SIGNUP CONTROLLER
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  return res.status(201).json({
    status: "OK",
    data: newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please Provide email and Password!", 400));
  }

  // 2) check if password is correct
  const user = await User.findOne({ email }).select("+password");

  // correctPassword is an instance method
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect  Email Or Password", 401));
  }

  // 3) if everything is correct send the token to the user
  const token = signToken(user._id);
  res.status(200).json({
    status: "OK",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting the token and checking if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in!  Please login to get access", 401)
    );
  }
  // 2)  Token Verification
  const decoded = await promisify(verify)(token, process.env.JWT_SECRET);

  // 3) check if user exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return new AppError(
      "The user belonging to the token does no longer exists",
      401
    );
  }

  // 4) check if user changed password after the token was created
  if (await freshUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please Login again.", 401)
    );
  }

  // success case
  // set User on Request
  req.user = freshUser;
  // GRANT ACCESS TO PROTECTED ROUTE
  next();
});
