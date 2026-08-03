import { useState } from "react";

function CommentForm({ onSubmit }) {
  const [text, setText] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!text.trim()) return;

    await onSubmit(text);

    setText("");
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a comment"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Post</button>
    </form>
  );
}

export default CommentForm;
