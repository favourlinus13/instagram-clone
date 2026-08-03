import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import {
  getUserProfile,
  followUser,
  unfollowUser,
} from "../services/user.service";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [usersProfile, setUsersProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = user.id === id;

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(id);

        setIsFollowing(false);

        setUsersProfile((previous) => ({
          ...previous,
          followersCount: previous.followersCount - 1,
        }));
      } else {
        await followUser(id);

        setIsFollowing(true);

        setUsersProfile((previous) => ({
          ...previous,
          followersCount: previous.followersCount + 1,
        }));
      }
    } catch (error) {
      console.error(error.response);
    }
  };

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile(id);

      console.log(data);

      setUsersProfile(data.user);
      setIsFollowing(data.user.isFollowing);
      setPosts(data.posts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <>
      <div>
        <img
          src={usersProfile.profilePicture || null}
          alt={usersProfile.username}
          width={120}
        />
        {isOwnProfile && (
          <>
            <button onClick={() => navigate("/profile/edit")}>
              Edit Profile
            </button>
            <button onClick={() => navigate("/saved")}>Saved Posts</button>
          </>
        )}
        {!isOwnProfile && (
          <button onClick={() => handleFollowToggle()}>
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
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

export default Profile;
