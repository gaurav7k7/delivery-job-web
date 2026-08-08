import { Router } from 'express';
import * as awardController from '../controllers/award.controller.js';
import { createCrudRoutes } from './routeFactory.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { createAwardSchema, updateAwardSchema } from '../validators/award.validator.js';

const router = Router();

router.get('/public', cacheResponse(300), awardController.listPublic);

router.use(
  createCrudRoutes({
    controller: awardController,
    permissionKey: 'awards:manage',
    createSchema: createAwardSchema,
    updateSchema: updateAwardSchema,
    supportsReorder: true,
  })
);

export default router;
