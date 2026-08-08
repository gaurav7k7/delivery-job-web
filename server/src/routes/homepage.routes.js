import { Router } from 'express';
import * as homepageController from '../controllers/homepage.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { updateHomepageSchema } from '../validators/homepage.validator.js';

const router = Router();

router.get('/', cacheResponse(300), homepageController.get);
router.patch(
  '/',
  authenticate,
  authorize('homepage:manage'),
  validate(updateHomepageSchema),
  homepageController.update
);

export default router;
