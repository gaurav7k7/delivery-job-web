import { Router } from 'express';
import * as permissionController from '../controllers/permission.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { createPermissionSchema, updatePermissionSchema } from '../validators/permission.validator.js';

const router = Router();

router.use(authenticate, authorize('permissions:manage'));

router.get('/', permissionController.list);
router.get('/:id', permissionController.getOne);
router.post('/', validate(createPermissionSchema), permissionController.create);
router.patch('/:id', validate(updatePermissionSchema), permissionController.update);
router.patch('/:id/toggle-status', permissionController.toggleStatus);
router.patch('/:id/restore', permissionController.restore);
router.delete('/:id', permissionController.remove);

export default router;
