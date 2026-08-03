const { body } = require("express-validator");

const updateProfileValidation = [
  body("fullname")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("full name cannot be empty.")
    .isLength({ max: 100 })
    .withMessage("full name cannot exceed 100 characters."),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Bio cannot exceed 150 characters."),

  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("username must be between 3 and 30 characters."),
];

module.exports = {
  updateProfileValidation,
};
