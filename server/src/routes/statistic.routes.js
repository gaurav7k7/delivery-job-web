import { Router } from 'express';
import * as statisticController from '../controllers/statistic.controller.js';
import { createCrudRoutes } from './routeFactory.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { createStatisticSchema, updateStatisticSchema } from '../validators/statistic.validator.js';

const router = Router();

router.get('/public', cacheResponse(300), statisticController.listPublic);

router.use(
  createCrudRoutes({
    controller: statisticController,
    permissionKey: 'statistics:manage',
    createSchema: createStatisticSchema,
    updateSchema: updateStatisticSchema,
    supportsReorder: true,
  })
);

export default router;
