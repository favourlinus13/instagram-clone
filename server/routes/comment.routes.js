const express = require("express");
const protect = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");
const { createCommentValidation } = require("../validators/comment.validator");
const {
  addComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../controllers/comment.controller");

const router = express.Router();

router.post(
  "/posts/:id/comments",
  protect,
  createCommentValidation,
  validate,
  addComment,
);
router.get("/posts/:id/comments", protect, getComments);
router.put("/comments/:id", protect, updateComment);
router.delete("/comments/:id", protect, deleteComment);

module.exports = router;
