import { Router } from 'express';
import * as siteSettingController from '../controllers/siteSetting.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { updateSiteSettingSchema } from '../validators/siteSetting.validator.js';

const router = Router();

router.get('/', cacheResponse(300), siteSettingController.get);
router.patch(
  '/',
  authenticate,
  authorize('settings:manage'),
  validate(updateSiteSettingSchema),
  siteSettingController.update
);

export default router;
