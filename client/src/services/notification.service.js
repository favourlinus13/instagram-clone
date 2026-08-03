import API from "./api";

export const getNotifications = async () => {
  const response = await API.get("/notifications");
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await API.patch(`/notifications/${notificationId}/read`);

  return response.data;
};

export const deleteNotification = async (notificationId) => {
  const response = await API.delete(`/notifications/${notificationId}`);

  return response.data;
};
