import { Router } from 'express';
import * as faqController from '../controllers/faq.controller.js';
import { createCrudRoutes } from './routeFactory.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { createFaqSchema, updateFaqSchema } from '../validators/faq.validator.js';

const router = Router();

router.get('/public', cacheResponse(300), faqController.listPublic);

router.use(
  createCrudRoutes({
    controller: faqController,
    permissionKey: 'faq:manage',
    createSchema: createFaqSchema,
    updateSchema: updateFaqSchema,
    supportsReorder: true,
  })
);

export default router;
