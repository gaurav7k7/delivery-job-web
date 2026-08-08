import { RiderApplication, ContactRequest, Testimonial, Blog, JobApplication } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { RIDER_APPLICATION_STATUSES } from '../constants/enums.js';

const OPEN_JOB_APPLICATION_STATUSES = ['applied', 'shortlisted', 'interviewing', 'offered'];
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const getStats = async (req, res) => {
  const weekStart = new Date();
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - 6);

  const [
    riderStatusCounts,
    unreadMessages,
    pendingTestimonials,
    publishedBlogCount,
    openJobApplications,
    weeklyRaw,
    platformRaw,
  ] = await Promise.all([
    RiderApplication.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    ContactRequest.countDocuments({ status: 'unread', isDeleted: false }),
    Testimonial.countDocuments({ isApproved: false, isDeleted: false }),
    Blog.countDocuments({ status: 'published', isDeleted: false }),
    JobApplication.countDocuments({ status: { $in: OPEN_JOB_APPLICATION_STATUSES }, isDeleted: false }),
    RiderApplication.aggregate([
      { $match: { isDeleted: false, createdAt: { $gte: weekStart } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    ]),
    RiderApplication.aggregate([
      { $match: { isDeleted: false, preferredPlatforms: { $exists: true, $ne: [] } } },
      { $unwind: '$preferredPlatforms' },
      { $group: { _id: '$preferredPlatforms', count: { $sum: 1 } } },
      { $lookup: { from: 'platforms', localField: '_id', foreignField: '_id', as: 'platform' } },
      { $unwind: '$platform' },
      { $project: { _id: 0, platform: '$platform.name', count: 1 } },
      { $sort: { count: -1 } },
    ]),
  ]);

  const riderApplications = Object.fromEntries(RIDER_APPLICATION_STATUSES.map((status) => [status, 0]));
  for (const { _id, count } of riderStatusCounts) {
    if (_id in riderApplications) riderApplications[_id] = count;
  }

  const countsByDate = new Map(weeklyRaw.map(({ _id, count }) => [_id, count]));
  const weeklyApplications = [];
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + (6 - i));
    const key = date.toISOString().slice(0, 10);
    weeklyApplications.push({ day: WEEKDAY_LABELS[date.getDay()], applications: countsByDate.get(key) || 0 });
  }

  return new ApiResponse(200, {
    riderApplications,
    unreadMessages,
    pendingTestimonials,
    publishedBlogCount,
    openJobApplications,
    weeklyApplications,
    platformBreakdown: platformRaw,
  }).send(res);
};
