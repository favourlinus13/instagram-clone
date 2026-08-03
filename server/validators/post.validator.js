const { body } = require("express-validator");

const createPostValidation = [
  body("caption")
    .optional()
    .trim()
    .isLength({ max: 2200 })
    .withMessage("caption cannot exceed 2200 characters."),
];

module.exports = {
  createPostValidation,
};
