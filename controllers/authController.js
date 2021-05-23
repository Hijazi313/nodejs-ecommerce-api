const crypto = require("crypto");

const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const signToken = require("../utils/signToken");
const sendEmail = require("../utils/email");

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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get User based on posted Email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with this email address", 404));
  }
  // 2) Generate the random token
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send the token as email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/users/resetpassword/${resetToken}`;
  const message = `Forgot your password ? submit a PATCH request with your new password to the ${resetURL}. \n If you did not forget your password, please ignore this email.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password reset Token (valid for only 10 minutes)",
      message,
    });
    // send the response to the user
    return res.status(200).json({
      status: "OK",
      message: "An email has been sent to rest your Password!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Try Again Later!",
        500
      )
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) If token has not expired and there is user, set the new password

  if (!user) {
    return next(new AppError("Token is Invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  // because it only modified the document not updated
  await user.save();

  // 3) Update changedPasswordAt property for the current user

  // 4) Log the user in, Send JWT
  const token = signToken(user._id);
  res.status(200).json({
    status: "OK",
    token,
  });
});
