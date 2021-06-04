const Product = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

// Create Product
exports.createProduct = createOne(Product);

// READ ALL PRODUCTS
exports.readAllProducts = getAll(Product);

// READ ONE PRODUCT
exports.readProduct = getOne(
  Product,
  { path: "category" },
  "-image -isFeatured -shortDescription"
);

// Update Product
exports.updateProduct = updateOne(Product);

// Delete Product
exports.deleteProduct = deleteOne(Product);

// Aliasing for most viewd Products
exports.aliasMostViewd = catchAsync(async (req, res, next) => {
  req.query.limit = "6";
  req.query.sort = "-views";
  next();
});
