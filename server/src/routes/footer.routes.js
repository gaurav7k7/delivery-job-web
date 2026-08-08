import { Router } from 'express';
import * as footerConfigController from '../controllers/footerConfig.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { updateFooterConfigSchema } from '../validators/footerConfig.validator.js';

const router = Router();

router.get('/', cacheResponse(300), footerConfigController.get);
router.patch(
  '/',
  authenticate,
  authorize('footer:manage'),
  validate(updateFooterConfigSchema),
  footerConfigController.update
);

export default router;
