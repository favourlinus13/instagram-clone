import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../services/notification.service";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);

      setNotifications((previous) =>
        previous.filter((notification) => notification._id !== notificationId),
      );
    } catch (error) {
      console.error(error.response?.data);
    }
  };

  const handleRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();

        setNotifications(data.notifications);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {notifications.map((notification) => (
        <div key={notification._id}>
          <img
            src={notification.sender.profilePicture}
            alt={notification.sender.username}
            width={40}
          />

          <p>
            <strong>{notification.sender.username}</strong>{" "}
            {notification.type === "like" && "liked your post"}
            {notification.type === "comment" && "commented on your post"}
            {notification.type === "follow" && "started following you"}
          </p>

          {!notification.isRead && (
            <button onClick={() => handleRead(notification._id)}>
              Mark as Read
            </button>
          )}

          <button onClick={() => handleDelete(notification._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Notifications;
