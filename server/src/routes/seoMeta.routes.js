import { Router } from 'express';
import * as seoMetaController from '../controllers/seoMeta.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { createSeoMetaSchema, updateSeoMetaSchema } from '../validators/seoMeta.validator.js';

const router = Router();

router.get('/public', cacheResponse(300), seoMetaController.getPublicByRoute);

router.use(authenticate, authorize('seo:manage'));
router.get('/', seoMetaController.list);
router.get('/:id', seoMetaController.getOne);
router.post('/', validate(createSeoMetaSchema), seoMetaController.create);
router.patch('/:id', validate(updateSeoMetaSchema), seoMetaController.update);
router.patch('/:id/restore', seoMetaController.restore);
router.delete('/:id', seoMetaController.remove);

export default router;
