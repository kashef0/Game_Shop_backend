const express = require("express");
const router = express.Router();
const {
  register,
  login,
  registerAdmin,
} = require("../controllers/authController");
const { uploadProfilePic } = require("../middlewares/upload");

router.post("/register-admin", uploadProfilePic, registerAdmin);
router.post("/register", uploadProfilePic, register);
router.post("/login", login);

module.exports = router;
