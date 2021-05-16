const express = require("express");
const router = express.Router();
const {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
} = require("../controllers/categoriesController");

router.route("/").get(getCategories).post(createCategory);

router.route("/:id").get(getCategory).delete(deleteCategory);

module.exports = router;
