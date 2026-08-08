import { Router } from 'express';
import * as clientController from '../controllers/client.controller.js';
import { createCrudRoutes } from './routeFactory.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { createClientSchema, updateClientSchema } from '../validators/client.validator.js';

const router = Router();

router.get('/public', cacheResponse(300), clientController.listPublic);

router.use(
  createCrudRoutes({
    controller: clientController,
    permissionKey: 'clients:manage',
    createSchema: createClientSchema,
    updateSchema: updateClientSchema,
    supportsReorder: true,
  })
);

export default router;
