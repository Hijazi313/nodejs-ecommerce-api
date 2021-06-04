const Category = require("../models/categoryModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

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
exports.getCategories = getAll(Category);

// READ One Category
exports.getCategory = getOne(Category);

// Delete Category
exports.deleteCategory = deleteOne(Category);

// UPDATE Category
exports.updateCategory = updateOne(Category);
