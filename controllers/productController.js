const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createProduct = catchAsync(async (req, res, next) => {
  const {
    title,
    shortDescription,
    description,
    price,
    category,
    image,
    images,
    brand,
    countInStock,
    isFeatured,
  } = req.body;

  // Check is this category exists in Category collection
  const isCategory = await Category.findById(category);
  if (!isCategory) {
    return next(
      new AppError("This category does not exist in Category collection", 400)
    );
  }

  const product = new Product({
    title,
    shortDescription,
    description,
    price,
    category,
    image,
    images,
    brand,
    countInStock,
    isFeatured,
  });
  const newProduct = await product.save();
  if (!newProduct) {
    nex(new AppError("Product can not be created", 424));
  }
  return res.status(201).send({
    status: "OK",
    data: {
      product: newProduct,
    },
  });
});

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
    return res.status(200).send({
      message: "OK",
      data: {
        product,
      },
    });
  }
});

// Delete Product

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByIdAndRemove(id);
  if (!product) {
    return next(new AppError("Unable to find this product", 404));
  } else {
    return res.status(200).send({ status: "OK" });
  }
});

// Update Product
exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) return next(new AppError("This Product does not exist", 404));
  return res.status(200).json({
    status: "OK",
    data: {
      product,
    },
  });
});
