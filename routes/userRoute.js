const express = require("express");
// Custom Route Protection middleware
const protect = require("../middlewares/protect");

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { myProfile } = require("../controllers/userController");

const router = express.Router();

// Signup user
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.patch("/resetpassword/:token", resetPassword);

// @GET THE PROFILE OF THE CURRENT USER
// IF the user is logged in only then he can access his profile
router.get("/me", protect, myProfile);

// select only title shortDescription _id and image

module.exports = router;
