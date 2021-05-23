const express = require("express");
const restrictTo = require("../middlewares/restrictTo");
const protect = require("../middlewares/protect");

const router = express.Router();
const {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
} = require("../controllers/categoriesController");

router
  .route("/")
  .get(getCategories)
  .post(protect, restrictTo("user", "admin"), createCategory);

router
  .route("/:id")
  .get(getCategory)
  .delete(protect, restrictTo("user", "admin"), deleteCategory);

module.exports = router;
