const {
  register,
  login,
  getUserData,
  logout,
  updatePassword,
  forgotPassword,
  resetPassword,
} = require("../controller/user.controller");
const { isAuthenticated } = require("../middleware/auth");

const router = require("express").Router();
router.route("/resetPassword/:token").put(resetPassword);
router.post("/login", login);
router.post("/register", register);
router.get("/me", isAuthenticated, getUserData);
router.post("/logout", logout);
router.route("/update-password").patch(isAuthenticated, updatePassword);
router.route("/forgot-password").post(forgotPassword);

module.exports = router;
