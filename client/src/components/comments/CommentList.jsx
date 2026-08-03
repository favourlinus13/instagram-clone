import CommentItem from "./CommentItem";

function CommentList({ comments, onEdit, onDelete }) {
  return (
    <>
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          onEdit={() => onEdit(comment)}
          onDelete={() => onDelete(comment._id)}
        />
      ))}
    </>
  );
}

export default CommentList;
