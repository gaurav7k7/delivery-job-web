import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

/**
 * Builds the standard admin CRUD route set (list/get/create/update/toggle-
 * status/delete/restore[/bulk-delete][/reorder]) for a module whose
 * controller was built with createCrudController. Mirrors that factory's
 * philosophy: modules with public read endpoints or bespoke logic add their
 * own routes around this (see servicesRoutes) or skip it entirely for
 * fully custom modules (see authRoutes, settingsRoutes).
 */
export function createCrudRoutes({
  controller,
  permissionKey,
  createSchema,
  updateSchema,
  supportsReorder = false,
  supportsBulkDelete = true,
}) {
  const router = Router();

  router.use(authenticate, authorize(permissionKey));

  router.get('/', controller.list);
  router.get('/:id', controller.getOne);
  router.post('/', validate(createSchema), controller.create);
  router.patch('/:id', validate(updateSchema), controller.update);
  router.patch('/:id/toggle-status', controller.toggleStatus);
  router.patch('/:id/restore', controller.restore);
  router.delete('/:id', controller.remove);
  if (supportsBulkDelete) router.post('/bulk-delete', controller.bulkRemove);
  if (supportsReorder) router.post('/reorder', controller.reorder);

  return router;
}
