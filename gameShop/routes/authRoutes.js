const express = require("express");
const router = express.Router();
const {
  register,
  login,
  registerAdmin,
  loginAdmin
} = require("../controllers/authController");
const { uploadProfilePic } = require("../middlewares/upload");

router.post("/register-admin", uploadProfilePic, registerAdmin);
router.post("/login-admin", loginAdmin);
router.post("/register", uploadProfilePic, register);
router.post("/login", login);

module.exports = router;
