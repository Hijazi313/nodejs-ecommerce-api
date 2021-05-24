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
} = require("../controllers/userController");

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
// select only title shortDescription _id and image

module.exports = router;
