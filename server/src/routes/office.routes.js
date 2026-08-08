import { Router } from 'express';
import * as officeController from '../controllers/office.controller.js';
import { createCrudRoutes } from './routeFactory.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { createOfficeSchema, updateOfficeSchema } from '../validators/office.validator.js';

const router = Router();

router.get('/public', cacheResponse(300), officeController.listPublic);

router.use(
  createCrudRoutes({
    controller: officeController,
    permissionKey: 'offices:manage',
    createSchema: createOfficeSchema,
    updateSchema: updateOfficeSchema,
    supportsReorder: true,
  })
);

export default router;
