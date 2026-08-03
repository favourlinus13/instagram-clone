import API from "./api";

export const getPosts = async () => {
  const response = await API.get("/posts");
  return response.data;
};

export const createPost = async (formData) => {
  const response = await API.post("/posts", formData);
  return response.data;
};

export const likePost = async (postId) => {
  const response = await API.post(`/posts/${postId}/like`);
  return response.data;
};

export const unlikePost = async (postId) => {
  const response = await API.post(`/posts/${postId}/unlike`);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await API.delete(`/posts/${postId}`);
  return response.data;
};

export const updatePost = async (postId, postData) => {
  const response = await API.put(`/posts/${postId}`, postData);
  return response.data;
};

export const searchPosts = async (query) => {
  const response = await API.get(
    `/posts/search?q=${encodeURIComponent(query)}`,
  );

  return response.data;
};

export const getPostById = async (id) => {
  const response = await API.get(`/posts/${id}`);
  return response.data;
};
