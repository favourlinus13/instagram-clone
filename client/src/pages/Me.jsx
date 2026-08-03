import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import { getUserProfile } from "../services/user.service";
import { useNavigate } from "react-router-dom";

function Me() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [usersProfile, setUsersProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile(user.id);
      setUsersProfile(data.user);
      setPosts(data.posts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (!usersProfile) return <p>User not found.</p>;

  return (
    <>
      <div>
        <img
          src={usersProfile.profilePicture || null}
          alt={usersProfile.username}
          width={120}
        />

        <button onClick={() => navigate("/profile/edit")}>Edit Profile</button>

        <h3>{usersProfile.fullname}</h3>
        <p>@{usersProfile.username}</p>
        <p>{usersProfile.bio}</p>
        <p>Followers: {usersProfile.followersCount}</p>
        <p>Following: {usersProfile.followingCount}</p>
      </div>
      <h3>Posts</h3>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div className="profile-posts">
          {posts.map((post) => (
            <img
              key={post._id}
              src={post.images[0]?.url}
              alt={post.caption}
              width={150}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default Me;
