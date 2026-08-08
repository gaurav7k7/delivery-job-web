import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { createUserSchema, updateUserSchema } from '../validators/user.validator.js';

const router = Router();

router.use(authenticate, authorize('users:manage'));

router.get('/', userController.list);
router.get('/:id', userController.getOne);
router.post('/', validate(createUserSchema), userController.create);
router.patch('/:id', validate(updateUserSchema), userController.update);
router.patch('/:id/toggle-status', userController.toggleStatus);
router.patch('/:id/restore', userController.restore);
router.delete('/:id', userController.remove);
router.post('/bulk-delete', userController.bulkRemove);

export default router;
