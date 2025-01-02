const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity cannot be less than 1"],
    },
    price: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price cannot be negative"],
    },
    shippingAddress: {
      type: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
      },
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
