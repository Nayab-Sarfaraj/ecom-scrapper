const {
  createRazorPayOrder,
  verifyPayment,
} = require("../controller/payment.controller");
const { isAuthenticated } = require("../middleware/auth");

const router = require("express").Router();

router.route("/payment/order").post(isAuthenticated, createRazorPayOrder);
router.route("/payment/verify").post(isAuthenticated, verifyPayment);
module.exports = router;
