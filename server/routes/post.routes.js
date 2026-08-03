const express = require("express");
const protect = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const validate = require("../middleware/validation.middleware");
const { createPostValidation } = require("../validators/post.validator");
const {
  createPost,
  getAllPosts,
  getPostById,
  likePost,
  unlikePost,
  deletePost,
  updatePost,
  searchPosts,
} = require("../controllers/post.controller");

const router = express.Router();

router.post(
  "/",
  protect,
  upload.array("images", 10),
  createPostValidation,
  validate,
  createPost,
);
router.get("/", protect, getAllPosts);
router.get("/search", protect, searchPosts);
router.get("/:id", protect, getPostById);
router.post("/:id/like", protect, likePost);
router.post("/:id/unlike", protect, unlikePost);
router.delete("/:id", protect, deletePost);
router.put("/:id", protect, updatePost);

module.exports = router;
