import { jobApplicationRepository } from '../repositories/jobApplication.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { JobApplication, Career } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { uploadBuffer } from '../services/cloudinary.service.js';
import { invalidateCache } from '../middlewares/cache.middleware.js';
import { notify } from '../services/notification.service.js';

const base = createCrudController(jobApplicationRepository, 'JobApplication', 'job-applications');

export const list = base.list;
export const getOne = base.getOne;
export const remove = base.remove;
export const restore = base.restore;
export const bulkRemove = base.bulkRemove;

// Public submission — unauthenticated, so this uploads the resume itself
// rather than going through the admin media library.
export const create = async (req, res) => {
  const job = await Career.findOne({ _id: req.body.job, isDeleted: false, status: 'open' });
  if (!job) throw ApiError.badRequest('This job opening is no longer accepting applications');
  if (!req.file) throw ApiError.badRequest('Resume file is required');

  const uploadResult = await uploadBuffer(req.file.buffer, {
    folder: 'zerivon/resumes',
    resourceType: 'raw',
  });

  const application = await JobApplication.create({
    ...req.body,
    resume: { url: uploadResult.secure_url, publicId: uploadResult.public_id, filename: req.file.originalname },
  });

  await invalidateCache('job-applications');
  await notify({
    title: 'Job application received',
    message: `${application.fullName} applied for the ${job.title} role.`,
    link: '/admin/careers/applications',
  });
  return new ApiResponse(201, { id: application.id }, 'Application submitted successfully').send(res);
};

export const updateStatus = async (req, res) => {
  const doc = await jobApplicationRepository.updateById(req.params.id, req.body, req.user.id);
  if (!doc) throw ApiError.notFound('Application not found');
  await invalidateCache('job-applications');
  return new ApiResponse(200, doc, 'Application updated').send(res);
};
