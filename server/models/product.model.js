const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      enum: ["Electronics", "Fashion", "Home", "Books", "Other"],
    },
    brand: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
      default: 0,
    },
    numOfReviews: {
      type: Number,
    },
    reviews: {
      type: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
          },
          comment: String,
          rating: {
            type: Number,
            min: 0,
            max: 5,
          },
        },
        { _id: false },
      ],
      default: [],
    },
    coverImage: {
      type: String,
      required: [true, "Image URL is required"],
    },
    images: [{ type: String }],
    source: {
      type: String,
      required: [true, "Source is required"], // e.g., Amazon, Flipkart
      default: "Local",
    },
    productUrl: {
      type: String,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const Products = mongoose.model("Product", productSchema);
module.exports = Products;
