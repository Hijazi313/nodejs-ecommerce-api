const { Schema, model } = require("mongoose");
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

productSchema.methods.increaseView = function () {
  this.views += 1;
  return;
};
const Product = model("Product", productSchema);

module.exports = Product;
