const express = require("express");
const protect = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");
const { updateProfileValidation } = require("../validators/user.validator");
const {
  updateProfile,
  followUser,
  unfollowUser,
  getUserProfile,
  searchUsers,
  savePost,
  unsavePost,
  getSavedPosts,
} = require("../controllers/user.controller");

const router = express.Router();

router.put(
  "/profile",
  protect,
  updateProfileValidation,
  validate,
  updateProfile,
);

router.get("/search", protect, searchUsers);
router.get("/saved", protect, getSavedPosts);
router.post("/saved/:id", protect, savePost);
router.delete("/saved/:id", protect, unsavePost);
router.post("/:id/follow", protect, followUser);
router.post("/:id/unfollow", protect, unfollowUser);

router.get("/:id", protect, getUserProfile);

module.exports = router;
