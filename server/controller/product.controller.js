const Products = require("../models/product.model");
const fetchAmazonProducts = require("../utils/amazonScrapper");
const uploadOnCloudinary = require("../utils/cloudinary");
const Errorhandler = require("../utils/errorHandler");
const fetchFlipkartProduct = require("../utils/flipkartScrapper");
const testfetchAmazonProducts = require("../utils/testAmazonScrapper");
const { createNotification } = require("./notification.controller");

const createProduct = async (req, res, next) => {
  try {
    console.log(req.body);
    const { name, description, price, category, brand, stock } = req.body;

    // Validate required fields
    if (!name || !price || !category || !description) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    if (!req?.files?.coverImage || req.files.coverImage.length === 0) {
      return next(new Errorhandler("Cover image is required.", 400));
    }

    // Upload cover image if provided
    let coverImageUrl = "";
    if (req?.files?.coverImage && req.files.coverImage[0]) {
      const coverImage = await uploadOnCloudinary(req.files.coverImage[0].path);
      coverImageUrl = coverImage.secure_url;
    } else {
      return res.json({ success: false, message: "wrong" });
    }

    // Upload additional images if provided
    let productImages = [];
    if (req?.files?.images && Array.isArray(req.files.images)) {
      console.log(`here`);
      for (let img of req.files.images) {
        const uploadedImage = await uploadOnCloudinary(img.path);
        productImages.push(uploadedImage.secure_url);
      }
    }

    // Create the product instance
    const newProduct = new Products({
      name,
      description,
      price,
      category,
      brand,
      stock: stock || 0, // Default to 0 if not provided
      source: "Local",
      coverImage: coverImageUrl,
      images: productImages,
      vendor: req.user._id, // Assuming `req.user` contains authenticated user info
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    // Return the response
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the product.",
    });
  }
};

const getProductById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return next(new Errorhandler("Invalid product id", 401));
    const product = await Products.findById(id);
    if (!product) return next(new Errorhandler("Product not found", 401));
    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the product.",
    });
  }
};
const getAllProduct = async (req, res, next) => {
  try {
    const products = await Products.find();
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.log("ERROR WHILE FETCHING PRODUCTS");
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while feyc the product.",
    });
  }
};
const deleteProduct = async (req, res, next) => {
  try {
    if (!req.user.isVendor)
      return next(
        new Errorhandler("Please register as vendor to use this service", 401)
      );
    const id = req.params.id;
    if (!id) return next(new Errorhandler("Invalid product id", 401));
    const product = await Products.findById(id);
    if (!product) return next(new Errorhandler("Product not found", 401));
    if (product.vendor.toString() !== req.user._id.toString())
      return next(
        new Errorhandler(
          "You do not have permission to delete this product",
          401
        )
      );
    await Products.findByIdAndDelete(product._id);

    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log("ERROR WHILE FETCHING PRODUCTS");
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the product.",
    });
  }
};

const getProductByVendorId = async (req, res, next) => {
  try {
    if (!req.user.isVendor)
      return next(
        new Errorhandler("Please register as vendor to use this service", 401)
      );
    const product = await Products.find({ vendor: req.user._id });
    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.log("ERROR WHILE FETCHING PRODUCTS");
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the verndor the product.",
    });
  }
};

const editProduct = async (req, res, next) => {
  try {
    if (!req.user.isVendor)
      return next(
        new Errorhandler("Please register as vendor to use this service", 401)
      );
    const id = req.params.id;
    if (!id) return next(new Errorhandler("Id not found", 401));
    const product = await Products.findById(id);
    if (!product) return next(new Errorhandler("Product not found", 401));
    if (product.vendor.toString() !== req.user._id.toString())
      return next(
        new Errorhandler(
          "You do not have permission to delete this product",
          401
        )
      );

    // Destructure fields from the request body
    const { name, description, price, category, brand, stock } = req.body;

    // Update cover image if provided
    if (req?.files?.coverImage) {
      const coverImageUpload = await uploadOnCloudinary(
        req.files.coverImage[0].path
      );
      product.coverImage = coverImageUpload.secure_url;
    }

    if (req?.files?.images && Array.isArray(req.files.images)) {
      const productImages = [];
      for (const img of req.files.images) {
        const uploadedImage = await uploadOnCloudinary(img.path);
        productImages.push(uploadedImage.secure_url);
      }
      product.images.push(...productImages);
    }

    // Update other fields if provided
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (brand) product.brand = brand;
    if (stock !== undefined) product.stock = stock;

    // Save the updated product
    const updatedProduct = await product.save();

    // Return the response
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log("ERROR WHILE UPDAING THE PRODUCT");
    console.log(error);
    return next(new Errorhandler("Something went wrong", 200));
  }
};

const createProductReview = async (req, res, next) => {
  try {
    const productId = req.body.productId;
    const product = await Products.findById(productId);

    const { comment, rating } = req.body;
    console.log(req.body);
    const review = {
      user: req.user._id,
      rating,
      comment,
    };

    const isExist = product?.reviews.find(
      // here we are checking where the user has already given the review if it has given the review so we can replace the previous review
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isExist) {
      product.reviews.forEach((rev) => {
        // here if the user has already given the review then we ill rewrite the previous raing and  comment
        if (rev.user.toString() === req.user._id.toString()) {
          rev.rating = rating;
          rev.comment = comment;
        }
      });
    } else {
      console.log(product.reviews);
      // just pushing the review inside the reviews field
      product.reviews.push(review);
    }
    product.numOfReviews = product.reviews.length;
    let sum = 0;
    product.reviews.forEach((ele) => {
      sum += ele.rating;
    });
    product.rating = sum / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    return res
      .status(201)
      .json({ success: true, message: "review added successfully", product });
  } catch (error) {
    console.log("ERROR WHILE UPDAING THE PRODUCT");
    console.log(error);
    return next(new Errorhandler("Something went wrong", 200));
  }
};

const getSearchedProduct = async (req, res, next) => {
  try {
    const productsPerPage = 6;
    const page = req.query.page;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const toBeSkipped = Math.abs(productsPerPage * (page - 1));
    const searchQuery = req.query.searchQuery;

    let products = await Products.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
      ],
    })
      .skip(toBeSkipped)
      .populate({
        path: "vendor",
        match: { district: req.user.district.toLowerCase() },
        select: "name district",
      })
      .exec();

    if (products.length === 0) {
      products = await Products.find({
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { category: { $regex: searchQuery, $options: "i" } },
        ],
      })
        .skip(toBeSkipped)
        .populate({
          path: "vendor",
          match: { state: req.user.state.toLowerCase() },
          select: "name state",
        })
        .exec();
    }
    if (products.length == 0) {
      products = await Products.find({
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { category: { $regex: searchQuery, $options: "i" } },
        ],
      })
        .skip(toBeSkipped)
        .populate({
          path: "vendor",
          match: { country: req.user.country.toLowerCase() },
          select: "name country",
        })
        .exec();
    }
    let amazonProducts = await testfetchAmazonProducts(
      searchQuery,
      page,
      minPrice,
      maxPrice
    );
    if (amazonProducts?.length !== 0) {
      amazonProducts = amazonProducts.filter(
        (item) =>
          Object.hasOwn(item, "title") &&
          Object.hasOwn(item, "price") &&
          Object.hasOwn(item, "url") &&
          Object.hasOwn(item, "image")
      );
    }

    let flipkartProducts = await fetchFlipkartProduct(
      searchQuery,
      page,
      minPrice,
      maxPrice
    );
    if (flipkartProducts?.length === 0) {
      flipkartProducts = flipkartProducts.filter(
        (item) =>
          Object.hasOwn(item, "title") &&
          Object.hasOwn(item, "price") &&
          Object.hasOwn(item, "url") &&
          Object.hasOwn(item, "image")
      );
    }
    res
      .status(200)
      .json({ success: true, products, amazonProducts, flipkartProducts });
    console.log("here");
    if (products && products.length !== 0) {
      console.log("here");
      for (const prd of products) {
        const notification = await createNotification(
          prd.name,
          req.user,
          prd,
          prd.vendor
        );
        console.log(notification);
      }
    }
  } catch (error) {
    console.log("ERROR WHILE SEARCHING THE PRODUCT");
    console.log(error);
    return next(new Errorhandler("Something went wrong", 400));
  }
};

module.exports = {
  createProduct,
  getProductById,
  getAllProduct,
  deleteProduct,
  getProductByVendorId,
  editProduct,
  createProductReview,
  getSearchedProduct,
};
