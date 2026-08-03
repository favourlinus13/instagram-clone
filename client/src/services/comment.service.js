import API from "./api";

export const getComments = async (postId) => {
  const response = await API.get(`/posts/${postId}/comments`);

  return response.data;
};

export const addComment = async (postId, text) => {
  const response = await API.post(`/posts/${postId}/comments`, {
    text,
  });

  return response.data;
};

export const updateComment = async (commentId, text) => {
  const response = await API.put(`/comments/${commentId}`, {
    text,
  });

  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await API.delete(`/comments/${commentId}`);

  return response.data;
};
