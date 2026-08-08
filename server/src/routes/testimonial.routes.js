import { Router } from 'express';
import * as testimonialController from '../controllers/testimonial.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { publicWriteLimiter } from '../middlewares/rateLimiter.middleware.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { createTestimonialSchema, updateTestimonialSchema } from '../validators/testimonial.validator.js';

const router = Router();

router.get('/public', cacheResponse(180), testimonialController.listPublic);
router.post('/', publicWriteLimiter, validate(createTestimonialSchema), testimonialController.create);

router.use(authenticate, authorize('testimonials:manage'));
router.get('/', testimonialController.list);
router.get('/:id', testimonialController.getOne);
router.patch('/:id', validate(updateTestimonialSchema), testimonialController.update);
router.patch('/:id/toggle-status', testimonialController.toggleStatus);
router.patch('/:id/restore', testimonialController.restore);
router.delete('/:id', testimonialController.remove);
router.post('/bulk-delete', testimonialController.bulkRemove);
router.post('/reorder', testimonialController.reorder);

export default router;
