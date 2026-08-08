import { Router } from 'express';
import * as navigationController from '../controllers/navigation.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { createNavigationSchema, updateNavigationSchema } from '../validators/navigation.validator.js';

const router = Router();

router.get('/location/:location', cacheResponse(300), navigationController.getByLocation);

router.use(authenticate, authorize('navigation:manage'));
router.get('/', navigationController.list);
router.get('/:id', navigationController.getOne);
router.post('/', validate(createNavigationSchema), navigationController.create);
router.patch('/:id', validate(updateNavigationSchema), navigationController.update);
router.patch('/:id/toggle-status', navigationController.toggleStatus);
router.patch('/:id/restore', navigationController.restore);
router.delete('/:id', navigationController.remove);

export default router;
