import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import {
  getPostById,
  likePost,
  unlikePost,
  deletePost,
} from "../services/post.service";

import { savePost, unsavePost } from "../services/user.service";

import { getComments, addComment } from "../services/comment.service";

function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const postData = await getPostById(id);
      const commentData = await getComments(id);
     console.log(postData)
      setPost(postData.post);
      setComments(commentData.comments);
    } catch (error) {
      console.error(error.response);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  const isOwner = post.author._id === user.id;

  const hasLiked = post.likes.some((id) => id.toString() === user.id);

  const handleLike = async () => {
    try {
      if (hasLiked) {
        await unlikePost(post._id);

        setPost((previous) => ({
          ...previous,
          likes: previous.likes.filter((id) => id !== user.id),
        }));
      } else {
        await likePost(post._id);

        setPost((previous) => ({
          ...previous,
          likes: [...previous.likes, user.id],
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      if (post.isSaved) {
        await unsavePost(post._id);

        setPost((previous) => ({
          ...previous,
          isSaved: false,
        }));
      } else {
        await savePost(post._id);

        setPost((previous) => ({
          ...previous,
          isSaved: true,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    try {
      const data = await addComment(post._id, commentText);

      setComments((previous) => [...previous, data.comment]);

      setCommentText("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await deletePost(post._id);

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>{post.author.fullname}</h2>

      <p>@{post.author.username}</p>

      <img
        src={post.author.profilePicture}
        alt={post.author.username}
        width={60}
      />

      <hr />

      {post.images.map((image) => (
        <img key={image.publicId} src={image.url} alt="" width={350} />
      ))}

      <p>{post.caption}</p>

      <p>{post.likes.length} Likes</p>

      <p>{comments.length} Comments</p>

      <button onClick={handleLike}>{hasLiked ? "Unlike" : "Like"}</button>

      <button onClick={handleSave}>{post.isSaved ? "Unsave" : "Save"}</button>

      {isOwner && (
        <>
          <button onClick={() => navigate(`/posts/edit/${post._id}`)}>
            Edit
          </button>

          <button onClick={handleDelete}>Delete</button>
        </>
      )}

      <hr />

      <h3>Comments</h3>

      {comments.map((comment) => (
        <div key={comment._id}>
          <strong>{comment.author.username}</strong>

          <p>{comment.text}</p>
        </div>
      ))}

      <form onSubmit={handleComment}>
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
        />

        <button type="submit">Comment</button>
      </form>
    </div>
  );
}

export default PostDetails;
