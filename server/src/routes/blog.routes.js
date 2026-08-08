import { Router } from 'express';
import * as blogController from '../controllers/blog.controller.js';
import { createCrudRoutes } from './routeFactory.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';
import { createBlogSchema, updateBlogSchema } from '../validators/blog.validator.js';

const router = Router();

router.get('/public', cacheResponse(120), blogController.listPublic);
router.get('/public/categories', cacheResponse(300), blogController.listPublicCategories);
router.get('/public/:slug', cacheResponse(60), blogController.getPublicBySlug);

router.use(
  createCrudRoutes({
    controller: blogController,
    permissionKey: 'blog:manage',
    createSchema: createBlogSchema,
    updateSchema: updateBlogSchema,
  })
);

export default router;
