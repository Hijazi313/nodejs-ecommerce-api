const { Schema, model } = require("mongoose");
const orderSchema = new Schema(
  {
    orderItems: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
        require: true,
      },
    ],
    shippingAddress: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    country: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      require: true,
      default: "Pending",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    total: Number,
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema);

module.exports = Order;
