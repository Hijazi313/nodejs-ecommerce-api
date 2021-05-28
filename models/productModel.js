const { Schema, model } = require("mongoose");
const { default: slugify } = require("slugify");
const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
    },
    shortDescription: {
      type: String,
      required: [true, "Short Description is Required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, " Description is Required"],
    },
    price: {
      type: Number,
      required: [true, "Price is Required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is Required"],
    },
    image: {
      type: String,
    },
    images: [String],
    ratingsAverage: {
      type: Number,
      default: 5.0,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    brand: {
      type: String,
      default: "not specified",
    },
    countInStock: {
      type: Number,
      default: 0,
    },
    tags: [String],
    views: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

//
productSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true, replacement: "_" });
  //  if Document  is updated
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, replacement: "_" });
    return next();
  }
  return next();
});

//
productSchema.methods.increaseView = function () {
  this.views += 1;
  return;
};

// CREATE INDEXES
productSchema.index({ views: -1 });
productSchema.index({ slug: 1 });

const Product = model("Product", productSchema);

module.exports = Product;
