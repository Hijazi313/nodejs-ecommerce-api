const express = require("express");
// Custom Route Protection middleware
const protect = require("../middlewares/protect");

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/authController");
const {
  myProfile,
  deleteMe,
  getAllUsers,
  updateMe,
  updateUser,
  readUser,
} = require("../controllers/userController");
const restrictTo = require("../middlewares/restrictTo");

const router = express.Router();

// Signup user
router.post("/signup", signup);
// Login User
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.patch("/resetpassword/:token", resetPassword);

// NOTE: This will make all next routes protected after this middleware
router.use(protect);

// IT's a protected Route
router.patch("/updatepassword", updatePassword);

// @GET THE PROFILE OF THE CURRENT USER
// IF the user is logged in only then he can access his profile and perform different actions
// IT's a protected Route
router.route("/me").get(myProfile).patch(updateMe).delete(deleteMe);

router.route("/").get(getAllUsers);

// UPDATE USER ONLY FOR ADMIN

// NOTE: Users with the role of admin can visit after this middleware
router.use(restrictTo("admin"));

// NOTE: ONLY User with the role of admin are can visit these routes
// NOTE: DO not change or update password with this route
// NOTE: Write separate tests for admin role based actions
router.route("/:id").get(readUser).patch(updateUser);

module.exports = router;
