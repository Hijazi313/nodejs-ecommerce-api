const express = require("express");
const protect = require("../middlewares/protect");

const {
  createProduct,
  readAllProducts,
  readProduct,
  deleteProduct,
  updateProduct,
  aliasMostViewd,
} = require("../controllers/productController");
const idCheck = require("../utils/idCheck");
const { isCategory } = require("../controllers/categoriesController");
const restrictTo = require("../middlewares/restrictTo");
const router = express.Router();

// Create a Product
router
  .route("/")
  .post(protect, restrictTo("admin"), isCategory, createProduct)
  .get(readAllProducts);

router.route("/most-viewed").get(aliasMostViewd, readAllProducts);

// TODO: Related Products  route
// select only title shortDescription _id and image

// Check if the provided is  in valid format
router.param("id", idCheck);

// GET || DELETE  A SINGLE PRODUCT
router
  .route("/:id")
  .get(readProduct)
  .delete(protect, restrictTo("admin"), deleteProduct)
  .patch(protect, restrictTo("admin"), updateProduct);

module.exports = router;
