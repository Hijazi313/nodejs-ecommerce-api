const express = require("express");
const restrictTo = require("../middlewares/restrictTo");
const protect = require("../middlewares/protect");

const {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} = require("../controllers/categoriesController");

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(protect, restrictTo("user", "admin"), createCategory);

router
  .route("/:id")
  .get(getCategory)
  .patch(protect, restrictTo("admin"), updateCategory)
  .delete(protect, restrictTo("user", "admin"), deleteCategory);

module.exports = router;
