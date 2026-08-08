import { riderApplicationRepository } from '../repositories/riderApplication.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { invalidateCache } from '../middlewares/cache.middleware.js';
import { notify } from '../services/notification.service.js';

const base = createCrudController(riderApplicationRepository, 'RiderApplication', 'rider-applications');

export const list = base.list;
export const getOne = base.getOne;
export const remove = base.remove;
export const restore = base.restore;
export const bulkRemove = base.bulkRemove;

// Public lead-capture submission — the core "Become a Rider" conversion funnel.
export const create = async (req, res) => {
  const doc = await riderApplicationRepository.create(req.body, undefined);
  await invalidateCache('rider-applications');
  await notify({
    title: 'New rider application',
    message: `${doc.fullName} applied from ${doc.city}.`,
    link: '/admin/careers/rider-applications',
  });
  return new ApiResponse(
    201,
    { id: doc.id },
    'Application submitted successfully. Our team will contact you shortly.'
  ).send(res);
};

export const updateStatus = async (req, res) => {
  const doc = await riderApplicationRepository.updateById(req.params.id, req.body, req.user.id);
  if (!doc) throw ApiError.notFound('Application not found');
  await invalidateCache('rider-applications');
  return new ApiResponse(200, doc, 'Application updated').send(res);
};
