const Category = require("../models/categoryModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// CREATE CATEGORIES_CONTROLLER
// @METHOD POST
exports.createCategory = catchAsync(async (req, res, next) => {
  const { name, color, icon } = req.body;

  let category = new Category({
    name,
    color,
    icon,
  });

  category = await category.save();
  if (!category) {
    return res
      .status(424)
      .send({ status: "failed", message: "The category cannot be created" });
  }
  return res.status(201).send({ status: "OK", data: category });
});

//

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findByIdAndRemove(id);
  if (!category) {
    return next(new AppError("unable to find this category", 404));
  }
  return res.status(204).json({ status: "OK", message: "Category daleted" });
});

// GET ALL CATEGORIES
exports.getCategories = catchAsync(async (req, res, next) => {
  const category = await Category.find();

  return res.status(200).send({ status: "OK", data: category });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  // if no category it will return null
  if (!category) {
    return next(new AppError("unable to find this category", 404));
  }
  return res.status(200).send({ status: "OK", data: category });
});
