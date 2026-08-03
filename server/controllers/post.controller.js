const Post = require("../models/post.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const deleteFromCloudinary = require("../utils/deleteFromCloudinary");
const createNotification = require("../utils/createNotification");

const searchPosts = async (req, res, next) => {
  try {
    const { q } = req.query;
    const currentUser = await User.findById(req.user.id).select("savedPosts");

    // Validate search query
    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    const posts = await Post.find({
      caption: {
        $regex: q,
        $options: "i",
      },
    })
      .populate("author", "fullname username profilePicture")
      .sort({ createdAt: -1 });

    const postsWithSavedStatus = posts.map((post) => {
      const postObject = post.toObject();

      postObject.isSaved = currentUser.savedPosts.some(
        (savedPostId) => savedPostId.toString() === post._id.toString(),
      );

      return postObject;
    });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts: postsWithSavedStatus,
    });
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { caption } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload atleast one image",
      });
    }

    const imageUrls = [];

    for (const file of req.files) {
      const uploadedImage = await uploadToCloudinary(file.buffer);
      console.log(uploadedImage);
      imageUrls.push({
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      });
    }

    const post = await Post.create({
      author: req.user.id,
      caption,
      images: imageUrls,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully.",
      post,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const currentUser = await User.findById(req.user.id).select("savedPosts");

    const posts = await Post.find()
      .populate("author", " fullname username profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const postsWithSavedStatus = posts.map((post) => {
      const postObject = post.toObject();

      postObject.isSaved = currentUser.savedPosts.some(
        (savedPostId) => savedPostId.toString() === post._id.toString(),
      );

      return postObject;
    });

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      posts: postsWithSavedStatus,
    });
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const currentUser = await User.findById(req.user.id).select("savedPosts");

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(postId).populate(
      "author",
      "fullname username profilePicture",
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const postObject = post.toObject();

    postObject.isSaved = currentUser.savedPosts.some(
      (savedPostId) => savedPostId.toString() === post._id.toString(),
    );

    res.status(200).json({
      success: true,
      post: postObject,
    });
  } catch (error) {
    next(error);
  }
};

const likePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID.",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    if (post.likes.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You have already liked this post",
      });
    }

    await post.likes.push(userId);

    await post.save();

    await createNotification({
      recipient: post.author,
      sender: req.user.id,
      type: "like",
      post: post._id,
    });

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

const unlikePost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!post.likes.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You have not liked this post",
      });
    }

    post.likes = await post.likes.filter((id) => id.toString() !== userId);

    await post.save();

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this post",
      });
    }

    for (const image of post.images) {
      await deleteFromCloudinary(image.publicId);
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { caption, images } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID.",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this post.",
      });
    }

    if (caption !== undefined) {
      post.caption = caption;
    }

    if (images !== undefined) {
      if (!Array.isArray(images) || images.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Image must be a non-empty array",
        });
      }

      post.images = images;
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  likePost,
  unlikePost,
  deletePost,
  updatePost,
  searchPosts,
};
