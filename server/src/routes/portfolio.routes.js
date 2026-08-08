import { Router } from 'express';
import * as portfolioController from '../controllers/portfolio.controller.js';
import { createCrudRoutes } from './routeFactory.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { createPortfolioSchema, updatePortfolioSchema } from '../validators/portfolio.validator.js';

const router = Router();

router.get('/public', cacheResponse(300), portfolioController.listPublic);
router.get('/public/:slug', cacheResponse(300), portfolioController.getPublicBySlug);

router.use(
  createCrudRoutes({
    controller: portfolioController,
    permissionKey: 'portfolio:manage',
    createSchema: createPortfolioSchema,
    updateSchema: updatePortfolioSchema,
    supportsReorder: true,
  })
);

export default router;
