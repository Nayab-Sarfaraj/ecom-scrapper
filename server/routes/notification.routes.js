const {
  getNotifications,
  getNotification,
} = require("../controller/notification.controller");
const { isAuthenticated } = require("../middleware/auth");

const router = require("express").Router();

router.route("/notifications").get(isAuthenticated, getNotifications);
router.route("/notification/:id").get(isAuthenticated, getNotification);
module.exports = router;
