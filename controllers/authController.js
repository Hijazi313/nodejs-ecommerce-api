const crypto = require("crypto");

const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const signToken = require("../utils/signToken");
const sendEmail = require("../utils/email");

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove The Password from the user body
  user.password = undefined;

  return res.status(statusCode).json({
    status: "OK",
    data: user,
    token,
  });
};

// USER SIGNUP CONTROLLER
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createAndSendToken(newUser, 201, res);
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
  createAndSendToken(user, 200, res);
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
  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { password, newpassword } = req.body;

  // Get User from collection
  const user = await User.findById(req.user._id).select("+password");

  // 2) Check if Posted current password is correct
  const isCorrectPassword = await user.correctPassword(password, user.password);
  if (!isCorrectPassword)
    return next(new AppError("Please Enter Correct  Current Password", 401));

  // 3) If so, update password
  user.password = newpassword;
  await user.save();

  // 4) Log user in, send JWT
  createAndSendToken(user, 200, res);
});
