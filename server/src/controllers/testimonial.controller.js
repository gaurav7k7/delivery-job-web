import { testimonialRepository } from '../repositories/testimonial.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { Testimonial } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { invalidateCache } from '../middlewares/cache.middleware.js';
import { notify } from '../services/notification.service.js';

const base = createCrudController(testimonialRepository, 'Testimonial', 'testimonials');

export const list = base.list;
export const getOne = base.getOne;
export const update = base.update;
export const toggleStatus = base.toggleStatus;
export const remove = base.remove;
export const restore = base.restore;
export const bulkRemove = base.bulkRemove;
export const reorder = base.reorder;

// Public submission — created unapproved; only visible publicly after admin review.
export const create = async (req, res) => {
  const doc = await testimonialRepository.create({ ...req.body, isApproved: false }, undefined);
  await invalidateCache('testimonials');
  await notify({
    title: 'Testimonial awaiting approval',
    message: `A new testimonial from ${doc.name} needs review before it goes live.`,
    link: '/admin/content/testimonials',
  });
  return new ApiResponse(201, { id: doc.id }, 'Thank you! Your testimonial will appear after review.').send(res);
};

export const listPublic = async (req, res) => {
  const testimonials = await Testimonial.find({ isApproved: true, isActive: true, isDeleted: false })
    .populate({ path: 'platform', select: 'name slug logo' })
    .sort('order')
    .lean();
  return new ApiResponse(200, testimonials).send(res);
};
