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
} = require("../controllers/userController");
const restrictTo = require("../middlewares/restrictTo");

const router = express.Router();

// Signup user
router.post("/signup", signup);
// Login User
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.patch("/resetpassword/:token", resetPassword);
router.patch("/updatepassword", protect, updatePassword);

// @GET THE PROFILE OF THE CURRENT USER
// IF the user is logged in only then he can access his profile and perform different actions
router
  .route("/me")
  .get(protect, myProfile)
  .patch(protect, updateMe)
  .delete(protect, deleteMe);

router.route("/").get(protect, getAllUsers);

// UPDATE USER ONLY FOR ADMIN
// NOTE: DO not change or update password with this route
router.route("/:id").patch(protect, restrictTo("admin"), updateUser);

module.exports = router;
