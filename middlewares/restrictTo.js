const AppError = require("../utils/appError");
// get the roles as a argument
module.exports =
  (...roles) =>
  (req, res, next) => {
    // keep in mind the scalability
    // roles could be an array [admin, editor]

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You Dont have permission to perform this action", 403)
      );
    }
    next();
  };
