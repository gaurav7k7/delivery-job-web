import { Router } from 'express';
import * as contactRequestController from '../controllers/contactRequest.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { publicWriteLimiter } from '../middlewares/rateLimiter.middleware.js';
import {
  createContactRequestSchema,
  updateContactRequestSchema,
} from '../validators/contactRequest.validator.js';

const router = Router();

router.post('/', publicWriteLimiter, validate(createContactRequestSchema), contactRequestController.create);

router.use(authenticate, authorize('contact-requests:manage'));
router.get('/', contactRequestController.list);
router.get('/:id', contactRequestController.getOne);
router.patch('/:id', validate(updateContactRequestSchema), contactRequestController.updateStatus);
router.patch('/:id/restore', contactRequestController.restore);
router.delete('/:id', contactRequestController.remove);
router.post('/bulk-delete', contactRequestController.bulkRemove);

export default router;
