import { Router } from 'express';
import * as roleController from '../controllers/role.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { createRoleSchema, updateRoleSchema } from '../validators/role.validator.js';

const router = Router();

router.use(authenticate, authorize('roles:manage'));

router.get('/', roleController.list);
router.get('/:id', roleController.getOne);
router.post('/', validate(createRoleSchema), roleController.create);
router.patch('/:id', validate(updateRoleSchema), roleController.update);
router.patch('/:id/toggle-status', roleController.toggleStatus);
router.patch('/:id/restore', roleController.restore);
router.delete('/:id', roleController.remove);
router.post('/bulk-delete', roleController.bulkRemove);

export default router;
