const User = require("../models/user.model");
const Post = require("../models/post.model");
const mongoose = require("mongoose");
const createNotification = require("../utils/createNotification");

const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const users = await User.find({
      username: {
        $regex: q,
        $options: "i",
      },
    })
      .select("fullname username profilePicture")
      .limit(5);

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { fullname, username, bio, profilePicture } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "username already taken",
        });
      }
    }

    if (fullname) user.fullname = fullname;
    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    next(error);
  }
};

const followUser = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (currentUserId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (currentUser.following.includes(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: "You are already following this user.",
      });
    }

    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    await createNotification({
      recipient: targetUser._id,
      sender: currentUser._id,
      type: "follow",
    });

    res.status(200).json({
      success: true,
      message: `You are now following ${targetUser.username}`,
    });
  } catch (error) {
    next(error);
  }
};

const unfollowUser = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (currentUserId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot unfollow yourself",
      });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!currentUser.following.includes(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: "You are not following this user.",
      });
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId,
    );

    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId,
    );

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: `You have successfully unfollowed ${targetUser.username}`,
    });
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isFollowing = user.followers.some(
      (followerId) => followerId.toString() === req.user.id,
    );

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        bio: user.bio,
        profilePicture: user.profilePicture,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        isFollowing,
      },
      posts,
    });
  } catch (error) {
    next(error);
  }
};

const savePost = async (req, res, next) => {
  try {
    const postId = req.params.id;

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

    const user = await User.findById(req.user.id);

    const alreadySaved = user.savedPosts.some((id) => id.toString() === postId);

    if (alreadySaved) {
      return res.status(400).json({
        success: false,
        message: "Post is already saved.",
      });
    }

    user.savedPosts.push(postId);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Post saved successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const unsavePost = async (req, res, next) => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID.",
      });
    }

    const user = await User.findById(req.user.id);

    const isSaved = user.savedPosts.some((id) => id.toString() === postId);

    if (!isSaved) {
      return res.status(400).json({
        success: false,
        message: "Post is not saved.",
      });
    }

    user.savedPosts = user.savedPosts.filter((id) => id.toString() !== postId);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Post removed from saved posts.",
    });
  } catch (error) {
    next(error);
  }
};

const getSavedPosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "savedPosts",
      populate: {
        path: "author",
        select: "fullname username profilePicture",
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      count: user.savedPosts.length,
      posts: user.savedPosts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile,
  followUser,
  unfollowUser,
  getUserProfile,
  searchUsers,
  savePost,
  unsavePost,
  getSavedPosts,
};
