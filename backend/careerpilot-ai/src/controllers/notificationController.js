import NotificationService from "../services/notificationService.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await NotificationService.getUserNotifications(req.user._id);
  return res.json(notifications);
});

export const markRead = asyncHandler(async (req, res) => {
  const updated = await NotificationService.markNotificationRead(req.user._id, req.params.id);
  return res.json(updated);
});

export const markAllRead = asyncHandler(async (req, res) => {
  const result = await NotificationService.markAllRead(req.user._id);
  return res.json(result);
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const result = await NotificationService.removeNotification(req.user._id, req.params.id);
  return res.json(result);
});
