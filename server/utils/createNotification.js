const Notification = require("../models/notification.model");

const createNotification = async ({ recipient, sender, type, post = null }) => {
  if (recipient.toString() === sender.toString()) {
    return null;
  }

  const notification = await Notification.create({
    recipient,
    sender,
    type,
    post,
  });

  return notification;
};

module.exports = createNotification;
