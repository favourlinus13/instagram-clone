const express = require("express");
const protect = require("../middleware/auth.middleware");
const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/auth.controller");
const {
  registerValidation,
  loginValidation,
} = require("../validators/auth.validator");
const validate = require("../middleware/validation.middleware");

const router = express.Router();

router.post("/register", registerValidation, validate, registerUser);
router.post("/login", loginValidation, validate, loginUser);
router.get("/me", protect, getCurrentUser);

module.exports = router;
