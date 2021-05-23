const { promisify } = require("util");
const { verify } = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");

const AppError = require("../utils/appError");
module.exports = catchAsync(async (req, res, next) => {
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
