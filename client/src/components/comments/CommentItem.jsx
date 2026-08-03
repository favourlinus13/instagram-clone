import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function CommentItem({ comment, onEdit, onDelete }) {
  const { user } = useContext(AuthContext);
  const isOwner = comment.author._id === user.id;

  return (
    <div className="comment">
      <strong className="comment-username">{comment.author.username}</strong>

      <span className="comment-text">{comment.text}</span>

      {isOwner && (
        <>
          <button onClick={onEdit}>Edit</button>

          <button onClick={onDelete}>Delete</button>
        </>
      )}
    </div>
  );
}

export default CommentItem;
