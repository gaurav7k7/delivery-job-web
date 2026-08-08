import { Router } from 'express';
import * as activityLogController from '../controllers/activityLog.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate, authorize('activity-logs:manage'));
router.get('/', activityLogController.list);
router.get('/:id', activityLogController.getOne);

export default router;
