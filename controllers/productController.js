const Product = require("../models/productModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const { deleteOne, updateOne, createOne } = require("./handlerFactory");

// Create Product
exports.createProduct = createOne(Product);

// READ ALL PRODUCTS

exports.readAllProducts = catchAsync(async (req, res, next) => {
  // 1-A) Filtering
  // create a shallow copy of the req.query
  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "fields"];
  // Remove unwanted fields from queryObj
  excludeFields.forEach((field) => delete queryObj[field]);

  // 1-B) Advance Filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  // Build Query
  let query = Product.find(JSON.parse(queryStr));

  // 2)  Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // 3) Field Limiting or Also known as Projecting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v -updatedAt");
  }

  // 4) Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  let skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const numOfProducts = await Product.countDocuments();
    if (skip >= numOfProducts)
      return next(new AppError("This page does not exist", 404));
  }
  // Explain Query for dev purpose
  // const products = await query.explain();

  // EXECUTE QUERY
  const products = await query;

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

exports.readProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id)
    .select("-image -isFeatured -shortDescription")
    .populate("category");
  if (!product) {
    return next(new AppError("Unable to find this product", 404));
  } else {
    // Increase Signle product view
    await product.increaseView();
    product.save({ validateBeforeSave: false });

    return res.status(200).send({
      message: "OK",
      data: {
        product,
      },
    });
  }
});

// Delete Product
exports.deleteProduct = deleteOne(Product);

// Update Product
exports.updateProduct = updateOne(Product);

// Aliasing for most viewd Products
exports.aliasMostViewd = catchAsync(async (req, res, next) => {
  req.query.limit = "3";
  req.query.sort = "-views";
  next();
});
