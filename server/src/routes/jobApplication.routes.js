import { Router } from 'express';
import * as jobApplicationController from '../controllers/jobApplication.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { publicWriteLimiter } from '../middlewares/rateLimiter.middleware.js';
import { uploadDocument } from '../middlewares/upload.middleware.js';
import {
  createJobApplicationSchema,
  updateJobApplicationSchema,
} from '../validators/jobApplication.validator.js';

const router = Router();

router.post(
  '/',
  publicWriteLimiter,
  uploadDocument.single('resume'),
  validate(createJobApplicationSchema),
  jobApplicationController.create
);

router.use(authenticate, authorize('job-applications:manage'));
router.get('/', jobApplicationController.list);
router.get('/:id', jobApplicationController.getOne);
router.patch('/:id', validate(updateJobApplicationSchema), jobApplicationController.updateStatus);
router.patch('/:id/restore', jobApplicationController.restore);
router.delete('/:id', jobApplicationController.remove);
router.post('/bulk-delete', jobApplicationController.bulkRemove);

export default router;
