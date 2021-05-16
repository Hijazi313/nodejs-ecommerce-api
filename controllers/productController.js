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
    status: "success",
    product: newProduct,
  });
});

// READ ALL PRODUCTS

exports.readAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  if (!products) {
    return next(new AppError("Unable to find products", 424));
  } else {
    return res.status(200).send({ message: "success", products });
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
    return res.status(200).send({ message: "success", product });
  }
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByIdAndRemove(id);
  if (!product) {
    return next(new AppError("Unable to find this product", 404));
  } else {
    return res
      .status(200)
      .send({ status: "success", message: "product deleted" });
  }
});
