const {
  placeOrder,
  updatePaymentStatus,
  getVendorOrders,
  updateOrderStatus,
  getOrderById,
  fetchUserOrder,
} = require("../controller/order.controller");
const { isAuthenticated, authorizeRole } = require("../middleware/auth");
const router = require("express").Router();
router.route("/user/orders").get(isAuthenticated, fetchUserOrder);
router
  .route("/order/vendor/all")
  .get(isAuthenticated, authorizeRole, getVendorOrders);
router.route("/order/new").post(isAuthenticated, placeOrder);
router
  .route("/order/status/payment/:id")
  .post(isAuthenticated, authorizeRole, updatePaymentStatus);
router
  .route("/order/status/:id")
  .post(isAuthenticated, authorizeRole, updateOrderStatus);
router.route("/order/:id").get(isAuthenticated, authorizeRole, getOrderById);
module.exports = router;
