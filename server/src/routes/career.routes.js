import { Router } from 'express';
import * as careerController from '../controllers/career.controller.js';
import { createCrudRoutes } from './routeFactory.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { createCareerSchema, updateCareerSchema } from '../validators/career.validator.js';

const router = Router();

router.get('/public', cacheResponse(180), careerController.listPublic);
router.get('/public/:slug', cacheResponse(180), careerController.getPublicBySlug);

router.use(
  createCrudRoutes({
    controller: careerController,
    permissionKey: 'careers:manage',
    createSchema: createCareerSchema,
    updateSchema: updateCareerSchema,
  })
);

export default router;
