import API from "./api";

export const getUserProfile = async (userId) => {
  const response = await API.get(`/users/${userId}`);

  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await API.put("/users/profile", profileData);

  return response.data;
};

export const followUser = async (userId) => {
  const response = await API.post(`/users/${userId}/follow`);

  return response.data;
};

export const unfollowUser = async (userId) => {
  const response = await API.post(`/users/${userId}/unfollow`);

  return response.data;
};

export const searchUsers = async (query) => {
  const response = await API.get(
    `/users/search?q=${encodeURIComponent(query)}`,
  );

  return response.data;
};

export const savePost = async (postId) => {
  const response = await API.post(`/users/saved/${postId}`);
  return response.data;
};

export const unsavePost = async (postId) => {
  const response = await API.delete(`/users/saved/${postId}`);
  return response.data;
};

export const getSavedPosts = async () => {
  const response = await API.get("/users/saved");
  return response.data;
};
