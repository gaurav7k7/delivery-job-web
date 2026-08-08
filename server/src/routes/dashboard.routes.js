import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';

const router = Router();

// Any authenticated admin user can view dashboard stats — no single module
// permission fits a cross-cutting summary, and it's read-only.
router.get('/stats', authenticate, cacheResponse(60), dashboardController.getStats);

export default router;
