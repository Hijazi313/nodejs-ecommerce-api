const express = require("express");
const { signup, login } = require("../controllers/authController");
const router = express.Router();

// Signup user
router.post("/signup", signup);
router.post("/login", login);
// Create a Product
// router.route("/").post(createProduct).get(readAllProducts);

// select only title shortDescription _id and image

// // GET || DELETE  A SINGLE PRODUCT
// router.route("/:id").get(readProduct).delete(deleteProduct);

module.exports = router;
