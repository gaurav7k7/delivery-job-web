import { Router } from 'express';
import * as benefitController from '../controllers/benefit.controller.js';
import { createCrudRoutes } from './routeFactory.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { createBenefitSchema, updateBenefitSchema } from '../validators/benefit.validator.js';

const router = Router();

router.get('/public', cacheResponse(300), benefitController.listPublic);

router.use(
  createCrudRoutes({
    controller: benefitController,
    permissionKey: 'benefits:manage',
    createSchema: createBenefitSchema,
    updateSchema: updateBenefitSchema,
    supportsReorder: true,
  })
);

export default router;
