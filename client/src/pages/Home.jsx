import { useEffect, useState } from "react";
import PostList from "../components/posts/PostList";
import CreatePostForm from "../components/posts/CreatePostForm";
import { getPosts, deletePost, updatePost } from "../services/post.service";
import { savePost, unsavePost } from "../services/user.service";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getPosts();
      setPosts(data.posts);
    } catch (error) {
      console.error(error.response);
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = async (postId, isSaved) => {
    try {
      if (isSaved) {
        await unsavePost(postId);
      } else {
        await savePost(postId);
      }

      setPosts((previous) =>
        previous.map((post) =>
          post._id === postId
            ? {
                ...post,
                isSaved: !post.isSaved,
              }
            : post,
        ),
      );
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmed = window.confirm("Delete this post?");
    if (!confirmed) return;

    try {
      await deletePost(postId);
      setPosts((previousPosts) =>
        previousPosts.filter((post) => post._id !== postId),
      );
    } catch (error) {
      console.error(error.response);
    }
  };

  const handleUpdatePost = async (postId, caption) => {
    const newCaption = window.prompt("Edit caption", caption);
    if (!newCaption || newCaption === caption) return;

    try {
      const response = await updatePost(postId, { caption: newCaption });
      console.log(response);
      setPosts((previousPosts) =>
        previousPosts.map((currentPost) =>
          currentPost._id === postId
            ? { ...currentPost, caption: response.post.caption }
            : currentPost,
        ),
      );
    } catch (error) {
      console.error(error.response);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return <h2>Loading posts...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  if (posts.length === 0) {
    return <h2>No posts yet.</h2>;
  }

  return (
    <>
      <CreatePostForm onPostCreated={fetchPosts} />
      <PostList
        posts={posts}
        onDelete={handleDeletePost}
        onEdit={handleUpdatePost}
        handleSaveToggle={handleSaveToggle}
      />
    </>
  );
}

export default Home;
