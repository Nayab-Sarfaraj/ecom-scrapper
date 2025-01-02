const {
  createProduct,
  getProductById,
  getAllProduct,
  deleteProduct,
  getProductByVendorId,
  editProduct,
  createProductReview,
  getSearchedProduct,
} = require("../controller/product.controller");
const { isAuthenticated, authorizeRole } = require("../middleware/auth");
const upload = require("../middleware/multer");

const router = require("express").Router();

router.route("/product/new").post(
  isAuthenticated,
  authorizeRole,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  createProduct
);
router.route("/product/all").get(getAllProduct);
router.route("/products/all").get(isAuthenticated, getSearchedProduct);
router
  .route("/product/vendor/all")
  .get(isAuthenticated, authorizeRole, getProductByVendorId);
router
  .route("/product/:id")
  .get(isAuthenticated, authorizeRole, getProductById);
router.route("/product/:id").put(
  isAuthenticated,
  authorizeRole,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  editProduct
);
router
  .route("/product/:id")
  .delete(isAuthenticated, authorizeRole, deleteProduct);

router.route("/review").post(isAuthenticated, createProductReview);

module.exports = router;
