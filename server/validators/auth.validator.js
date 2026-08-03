const { body } = require("express-validator");

const registerValidation = [
  body("fullname").trim().notEmpty().withMessage("Full name is required."),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("username is required.")
    .isLength({ min: 3 })
    .withMessage("username must be atleast 3 characters."),

  body("email").trim().isEmail().withMessage("Please provide a valid email."),

  body("password")
    .isLength({ min: 6 })
    .withMessage("password must be atleast 6 characters."),
];

const loginValidation = [
  body("email").trim().isEmail().withMessage("please provide a valid email."),

  body("password").notEmpty().withMessage("password is required."),
];

module.exports = {
  registerValidation,
  loginValidation,
};
