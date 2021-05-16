const { Schema, model } = require("mongoose");
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
    },
    icon: {
      type: String,
    },
    color: String,
  },
  { timestamps: true }
);

const Category = model("Category", categorySchema);

module.exports = Category;
