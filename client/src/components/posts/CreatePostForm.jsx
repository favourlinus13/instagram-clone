import { useState } from "react";
import { createPost } from "../../services/post.service";

function CreatePostForm({ onPostCreated }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();

      formData.append("caption", caption);
      formData.append("images", image);

      await createPost(formData);
      await onPostCreated();

      setCaption("");
      setImage(null);

      console.log("Post created successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="caption">Caption</label>
        <textarea
          id="caption"
          value={caption}
          placeholder="Write a caption..."
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="image">Image</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>

      <button type="submit">Post</button>
    </form>
  );
}

export default CreatePostForm;
