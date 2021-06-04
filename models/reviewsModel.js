const { Schema, model } = require("mongoose");
const Product = require("./productModel");

// UserID
// ProductIDs
const reviewSchema = new Schema(
  {
    review: {
      type: String,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, " Review must belong to a Product"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a User"],
    },
    userName: {
      type: String,
      required: [true, " Review must contain a userName"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// Combined Index to ensure that one user and one product can have one unique index
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
// reviewSchema.virtual("id").get(function () {
//   return this._id.toHexString();
// });
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "product",
    select: "title _id",
  }).populate({
    path: "user",
    select: "fullName _id",
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: stats[0].avgRating,
      totalRatings: stats[0].nRating,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 5,
      totalRatings: 0,
    });
  }
};
reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.product);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.product._id);
});

const Review = model("Review", reviewSchema);

module.exports = Review;
