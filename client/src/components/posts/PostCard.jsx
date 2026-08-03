import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { likePost, unlikePost } from "../../services/post.service";
import {
  getComments,
  addComment,
  deleteComment,
  updateComment,
} from "../../services/comment.service";
import CommentList from "../comments/CommentList";
import CommentForm from "../comments/CommentForm";

function PostCard({
  postId,
  isSaved,
  username,
  image,
  caption,
  likes,
  postOwner,
  onDelete,
  onEdit,
  handleSaveToggle,
}) {
  const { user } = useContext(AuthContext);
  const isOwner = postOwner === user.id;

  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);

  const [likesCount, setLikesCount] = useState(likes.length);
  const [liked, setLiked] = useState(likes.includes(user.id));

  const handleLike = async () => {
    const previousLiked = liked;
    const previousLikesCount = likesCount;

    if (liked) {
      setLiked(false);
      setLikesCount((count) => count - 1);
    } else {
      setLiked(true);
      setLikesCount((count) => count + 1);
    }

    try {
      if (previousLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
    } catch (error) {
      console.error(error);

      setLiked(previousLiked);
      setLikesCount(previousLikesCount);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await getComments(postId);
      setComments(data.comments);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddCommment = async (text) => {
    try {
      await addComment(postId, text);
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditComment = async (comment) => {
    const newText = window.prompt("Edit comment", comments.text);
    if (!newText || newText === comment.text) return;

    try {
      await updateComment(comment._id, newText);
      await fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <article className="post-card">
      <header className="post-header">
        <Link to={`/profile/${postOwner}`}>
          <h3>{username}</h3>
        </Link>
        {isOwner && (
          <>
            <button onClick={() => onEdit(postId, caption)}>Edit</button>
            <button onClick={() => onDelete(postId)}>Delete Post</button>
          </>
        )}
        <button onClick={() => handleSaveToggle(postId, isSaved)}>
          {isSaved ? "Unsave" : "Save"}
        </button>
      </header>

      <Link to={`/posts/${postId}`}>
        <div className="post-image">
          <img src={image} alt={`${username}'s post`} />
        </div>
      </Link>

      <div className="post-actions">
        <button type="button" onClick={handleLike}>
          {liked ? "❤️" : "🤍"}
        </button>
        <span>{likesCount} likes</span>
        <button type="button">💬</button>
        <button type="button">📤</button>
      </div>

      <p>
        <strong>{username}</strong> {caption}
      </p>

      {comments.length === 0 ? (
        ""
      ) : loadingComments ? (
        <p>Comments loading...</p>
      ) : (
        <CommentList
          comments={comments}
          onEdit={handleEditComment}
          onDelete={handleDeleteComment}
        />
      )}

      <CommentForm onSubmit={handleAddCommment} />
    </article>
  );
}

export default PostCard;
