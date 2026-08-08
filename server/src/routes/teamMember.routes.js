import { Router } from 'express';
import * as teamMemberController from '../controllers/teamMember.controller.js';
import { createCrudRoutes } from './routeFactory.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { createTeamMemberSchema, updateTeamMemberSchema } from '../validators/teamMember.validator.js';

const router = Router();

router.get('/public', cacheResponse(300), teamMemberController.listPublic);

router.use(
  createCrudRoutes({
    controller: teamMemberController,
    permissionKey: 'team:manage',
    createSchema: createTeamMemberSchema,
    updateSchema: updateTeamMemberSchema,
    supportsReorder: true,
  })
);

export default router;
