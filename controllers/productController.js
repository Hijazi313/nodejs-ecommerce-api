const Product = require("../models/productModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");
const { deleteOne, updateOne, createOne, getOne } = require("./handlerFactory");

// Create Product
exports.createProduct = createOne(Product);

// READ ALL PRODUCTS

exports.readAllProducts = catchAsync(async (req, res, next) => {
  // Explain Query for dev purpose
  // const products = await query.explain();

  // EXECUTE QUERY
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .paginate()
    .limitfields()
    .sort();
  const products = await features.query;

  if (!products) {
    return next(new AppError("Unable to find products", 424));
  } else {
    return res.status(200).send({
      message: "OK",
      data: {
        products,
      },
    });
  }
});

// READ ONE PRODUCT

exports.readProduct = getOne(
  Product,
  { path: "category" },
  "-image -isFeatured -shortDescription"
);

// Delete Product
exports.deleteProduct = deleteOne(Product);

// Update Product
exports.updateProduct = updateOne(Product);

// Aliasing for most viewd Products
exports.aliasMostViewd = catchAsync(async (req, res, next) => {
  req.query.limit = "6";
  req.query.sort = "-views";
  next();
});
