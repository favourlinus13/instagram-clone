import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../services/user.service";

function EditProfile() {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [fullname, setFullname] = useState(user.fullname);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);

  const handleEditProfile = async (event) => {
    event.preventDefault();

    try {
      const data = await updateProfile({
        fullname,
        username,
        bio,
        profilePicture,
      });

      updateUser(data.user);
      navigate(`/profile/${user.id}`);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleEditProfile}>
      <div>
        <label htmlFor="">Full Name</label>
        <input
          type="text"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="">username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="">Bio</label>
        <textarea id="" value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>
      <div>
        <label htmlFor="">Profile Picture</label>
        <input
          type="text"
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
        />
      </div>

      <button type="submit">Edit</button>
    </form>
  );
}

export default EditProfile;
