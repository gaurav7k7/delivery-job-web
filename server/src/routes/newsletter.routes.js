import { Router } from 'express';
import * as newsletterController from '../controllers/newsletter.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { publicWriteLimiter } from '../middlewares/rateLimiter.middleware.js';
import { subscribeNewsletterSchema, unsubscribeNewsletterSchema } from '../validators/newsletter.validator.js';

const router = Router();

router.post('/subscribe', publicWriteLimiter, validate(subscribeNewsletterSchema), newsletterController.subscribe);
router.post(
  '/unsubscribe',
  publicWriteLimiter,
  validate(unsubscribeNewsletterSchema),
  newsletterController.unsubscribe
);

router.use(authenticate, authorize('newsletter:manage'));
router.get('/', newsletterController.list);
router.get('/:id', newsletterController.getOne);
router.patch('/:id/restore', newsletterController.restore);
router.delete('/:id', newsletterController.remove);
router.post('/bulk-delete', newsletterController.bulkRemove);

export default router;
