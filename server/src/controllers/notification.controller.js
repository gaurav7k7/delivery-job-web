import { Notification } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const list = async (req, res) => {
  const limit = Math.min(50, Number.parseInt(req.query.limit, 10) || 20);
  const notifications = await Notification.find({ isDeleted: false }).sort('-createdAt').limit(limit).lean();
  return new ApiResponse(200, notifications).send(res);
};

export const markRead = async (req, res) => {
  const doc = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { returnDocument: 'after' }
  );
  if (!doc) throw ApiError.notFound('Notification not found');
  return new ApiResponse(200, doc, 'Marked as read').send(res);
};

export const markAllRead = async (req, res) => {
  await Notification.updateMany({ isRead: false }, { isRead: true });
  return new ApiResponse(200, null, 'All notifications marked as read').send(res);
};
