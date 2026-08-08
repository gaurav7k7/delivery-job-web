import { Router } from 'express';
import * as socialLinkController from '../controllers/socialLink.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { createSocialLinkSchema, updateSocialLinkSchema } from '../validators/socialLink.validator.js';

const router = Router();

router.get('/public', cacheResponse(300), socialLinkController.listPublic);

router.use(authenticate, authorize('social-links:manage'));
router.get('/', socialLinkController.list);
router.get('/:id', socialLinkController.getOne);
router.post('/', validate(createSocialLinkSchema), socialLinkController.create);
router.patch('/:id', validate(updateSocialLinkSchema), socialLinkController.update);
router.patch('/:id/restore', socialLinkController.restore);
router.delete('/:id', socialLinkController.remove);
router.post('/reorder', socialLinkController.reorder);

export default router;
