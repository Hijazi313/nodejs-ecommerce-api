const { Schema, model } = require("mongoose");

// UserID
// ProductIDs
const reviewSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
    },
    shortDescription: {
      type: String,
      required: [true, "Short Description is Required"],
    },
    description: {
      type: String,
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
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: String,
      },
    ],
    brand: {
      type: String,
      default: "not specified",
    },
    countInStock: {
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

const Review = model("Review", reviewSchema);

module.exports = Review;
