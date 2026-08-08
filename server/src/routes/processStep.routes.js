import { Router } from 'express';
import * as processStepController from '../controllers/processStep.controller.js';
import { createCrudRoutes } from './routeFactory.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { createProcessStepSchema, updateProcessStepSchema } from '../validators/processStep.validator.js';

const router = Router();

router.get('/public/:page', cacheResponse(300), processStepController.listPublic);

router.use(
  createCrudRoutes({
    controller: processStepController,
    permissionKey: 'process-steps:manage',
    createSchema: createProcessStepSchema,
    updateSchema: updateProcessStepSchema,
    supportsReorder: true,
  })
);

export default router;
