import { contactRequestRepository } from '../repositories/contactRequest.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { invalidateCache } from '../middlewares/cache.middleware.js';
import { notify } from '../services/notification.service.js';

const base = createCrudController(contactRequestRepository, 'ContactRequest', 'contact-requests');

export const list = base.list;
export const getOne = base.getOne;
export const remove = base.remove;
export const restore = base.restore;
export const bulkRemove = base.bulkRemove;

export const create = async (req, res) => {
  const doc = await contactRequestRepository.create(req.body, undefined);
  await invalidateCache('contact-requests');
  await notify({
    title: 'New contact message',
    message: `${doc.name} asked: ${doc.message.slice(0, 80)}${doc.message.length > 80 ? '…' : ''}`,
    link: '/admin/engagement/messages',
  });
  return new ApiResponse(201, { id: doc.id }, 'Thanks for reaching out — we will get back to you shortly.').send(
    res
  );
};

export const updateStatus = async (req, res) => {
  const payload = { ...req.body };
  if (payload.status === 'replied') {
    payload.respondedBy = req.user.id;
    payload.respondedAt = new Date();
  }
  const doc = await contactRequestRepository.updateById(req.params.id, payload, req.user.id);
  if (!doc) throw ApiError.notFound('Contact request not found');
  await invalidateCache('contact-requests');
  return new ApiResponse(200, doc, 'Contact request updated').send(res);
};
