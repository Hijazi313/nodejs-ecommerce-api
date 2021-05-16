const express = require("express");
const {
  createProduct,
  readAllProducts,
  readProduct,
  deleteProduct,
} = require("../controllers/productController");
const idCheck = require("../utils/idCheck");
const router = express.Router();

// Create a Product
router.route("/").post(createProduct).get(readAllProducts);

// TODO: Relateg Products  route
// select only title shortDescription _id and image

// Check if the provided is  in valid format
router.param("id", idCheck);

// GET || DELETE  A SINGLE PRODUCT
router.route("/:id").get(readProduct).delete(deleteProduct);

module.exports = router;
