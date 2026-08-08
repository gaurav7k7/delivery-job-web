import { Router } from 'express';
import * as serviceController from '../controllers/service.controller.js';
import { createCrudRoutes } from './routeFactory.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { createServiceSchema, updateServiceSchema } from '../validators/service.validator.js';

const router = Router();

router.get('/public', cacheResponse(300), serviceController.listPublic);
router.get('/public/:slug', cacheResponse(300), serviceController.getPublicBySlug);

router.use(
  createCrudRoutes({
    controller: serviceController,
    permissionKey: 'services:manage',
    createSchema: createServiceSchema,
    updateSchema: updateServiceSchema,
    supportsReorder: true,
  })
);

export default router;
