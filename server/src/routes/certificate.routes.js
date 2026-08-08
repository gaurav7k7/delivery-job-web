import { Router } from 'express';
import * as certificateController from '../controllers/certificate.controller.js';
import { createCrudRoutes } from './routeFactory.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { createCertificateSchema, updateCertificateSchema } from '../validators/certificate.validator.js';

const router = Router();

router.get('/public', cacheResponse(300), certificateController.listPublic);

router.use(
  createCrudRoutes({
    controller: certificateController,
    permissionKey: 'certificates:manage',
    createSchema: createCertificateSchema,
    updateSchema: updateCertificateSchema,
    supportsReorder: true,
  })
);

export default router;
