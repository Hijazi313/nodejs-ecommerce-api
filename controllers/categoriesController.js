const Category = require("../models/categoryModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { deleteOne, updateOne, createOne } = require("./handlerFactory");

// CREATE CATEGORIES_CONTROLLER
// @METHOD POST
exports.createCategory = createOne(Category);
//

// Check if Category exists
exports.isCategory = catchAsync(async (req, res, next) => {
  // Check if this category exists in Category collection
  const isCategory = await Category.findById(req.body.category);
  if (!isCategory) {
    return next(
      new AppError("This category does not exist in Category collection", 400)
    );
  }
  next();
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

// Delete Category
exports.deleteCategory = deleteOne(Category);

// UPDATE Category
exports.updateCategory = updateOne(Category);
