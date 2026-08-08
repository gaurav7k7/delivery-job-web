import { Router } from 'express';
import * as industryController from '../controllers/industry.controller.js';
import { createCrudRoutes } from './routeFactory.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { createIndustrySchema, updateIndustrySchema } from '../validators/industry.validator.js';

const router = Router();

router.get('/public', cacheResponse(300), industryController.listPublic);
router.get('/public/:slug', cacheResponse(300), industryController.getPublicBySlug);

router.use(
  createCrudRoutes({
    controller: industryController,
    permissionKey: 'industries:manage',
    createSchema: createIndustrySchema,
    updateSchema: updateIndustrySchema,
    supportsReorder: true,
  })
);

export default router;
