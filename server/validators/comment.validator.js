const { body } = require("express-validator");

const createCommentValidation = [
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Comment cannot be empty")
    .isLength({ max: 1000 })
    .withMessage("Comment cannot exceed 1000 characters"),
];

module.exports = {
  createCommentValidation,
};
