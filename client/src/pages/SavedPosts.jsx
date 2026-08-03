import { useEffect, useState } from "react";
import { getSavedPosts } from "../services/user.service";
import { Link } from "react-router-dom";

function SavedPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const data = await getSavedPosts();
        setPosts(data.posts);
      } catch (error) {
        console.error(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, []);

  if (loading) {
    return <p>Loading saved posts...</p>;
  }

  return (
    <div>
      <h2>Saved Posts</h2>

      {posts.length === 0 ? (
        <p>No saved posts yet.</p>
      ) : (
        <div className="saved-posts">
          {posts.map((post) => (
            <div key={post._id}>
              <img src={post.images[0]?.url} alt={post.caption} width={180} />

              <p>{post.caption}</p>

              <p>@{post.author.username}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedPosts;
