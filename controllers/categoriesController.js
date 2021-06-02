const Category = require("../models/categoryModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { deleteOne, updateOne } = require("./handlerFactory");

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
