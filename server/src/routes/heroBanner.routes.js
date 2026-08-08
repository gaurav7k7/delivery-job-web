import { Router } from 'express';
import * as heroBannerController from '../controllers/heroBanner.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { createHeroBannerSchema, updateHeroBannerSchema } from '../validators/heroBanner.validator.js';

const router = Router();

router.get('/page/:page', cacheResponse(120), heroBannerController.listPublicByPage);

router.use(authenticate, authorize('hero-banners:manage'));
router.get('/', heroBannerController.list);
router.get('/:id', heroBannerController.getOne);
router.post('/', validate(createHeroBannerSchema), heroBannerController.create);
router.patch('/:id', validate(updateHeroBannerSchema), heroBannerController.update);
router.patch('/:id/toggle-status', heroBannerController.toggleStatus);
router.patch('/:id/restore', heroBannerController.restore);
router.delete('/:id', heroBannerController.remove);
router.post('/reorder', heroBannerController.reorder);

export default router;
