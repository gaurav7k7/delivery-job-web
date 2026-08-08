import { Router } from 'express';
import * as riderApplicationController from '../controllers/riderApplication.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { publicWriteLimiter } from '../middlewares/rateLimiter.middleware.js';
import {
  createRiderApplicationSchema,
  updateRiderApplicationSchema,
} from '../validators/riderApplication.validator.js';

const router = Router();

router.post('/', publicWriteLimiter, validate(createRiderApplicationSchema), riderApplicationController.create);

router.use(authenticate, authorize('rider-applications:manage'));
router.get('/', riderApplicationController.list);
router.get('/:id', riderApplicationController.getOne);
router.patch('/:id', validate(updateRiderApplicationSchema), riderApplicationController.updateStatus);
router.patch('/:id/restore', riderApplicationController.restore);
router.delete('/:id', riderApplicationController.remove);
router.post('/bulk-delete', riderApplicationController.bulkRemove);

export default router;
