import { useState } from "react";
import { searchUsers } from "../services/user.service";
import { searchPosts } from "../services/post.service";

function Search() {
  const [query, setQuery] = useState("");

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleSearch = async (event) => {
    const value = event.target.value;

    setQuery(value);

    if (!value.trim()) {
      setUsers([]);
      setPosts([]);
      return;
    }

    try {
      setLoading(true);

      const [userData, postData] = await Promise.all([
        searchUsers(value),
        searchPosts(value),
      ]);

      setUsers(userData.users);
      setPosts(postData.posts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleSearch}
      />

      <h3>Users</h3>

      {users.map((user) => (
        <div key={user._id}>
          <img src={user.profilePicture} alt={user.username} width={40} />

          <p>{user.fullname}</p>
          <p>@{user.username}</p>
        </div>
      ))}

      <h3>Posts</h3>

      <div className="search-posts">
        {posts.map((post) => (
          <img
            key={post._id}
            src={post.images[0]?.url}
            alt={post.caption}
            width={120}
          />
        ))}
      </div>
    </div>
  );
}

export default Search;
