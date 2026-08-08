import { Router } from 'express';
import * as platformController from '../controllers/platform.controller.js';
import { createCrudRoutes } from './routeFactory.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { createPlatformSchema, updatePlatformSchema } from '../validators/platform.validator.js';

const router = Router();

router.get('/public', cacheResponse(300), platformController.listPublic);

router.use(
  createCrudRoutes({
    controller: platformController,
    permissionKey: 'platforms:manage',
    createSchema: createPlatformSchema,
    updateSchema: updatePlatformSchema,
    supportsReorder: true,
  })
);

export default router;
