import { Router } from 'express';
import * as pageContentController from '../controllers/pageContent.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { createPageContentSchema, updatePageContentSchema } from '../validators/pageContent.validator.js';

const router = Router();

router.get('/page/:pageSlug', cacheResponse(300), pageContentController.listPublicByPageSlug);

router.use(authenticate, authorize('page-content:manage'));
router.get('/', pageContentController.list);
router.get('/:id', pageContentController.getOne);
router.post('/', validate(createPageContentSchema), pageContentController.create);
router.patch('/:id', validate(updatePageContentSchema), pageContentController.update);
router.patch('/:id/toggle-status', pageContentController.toggleStatus);
router.patch('/:id/restore', pageContentController.restore);
router.delete('/:id', pageContentController.remove);
router.post('/reorder', pageContentController.reorder);

export default router;
