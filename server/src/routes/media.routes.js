import { Router } from 'express';
import * as mediaController from '../controllers/media.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { uploadImage } from '../middlewares/upload.middleware.js';
import { updateMediaSchema } from '../validators/media.validator.js';

const router = Router();

router.use(authenticate, authorize('media:manage'));

router.get('/', mediaController.list);
router.get('/folders', mediaController.listFolders);
router.get('/:id', mediaController.getOne);
router.post('/upload', uploadImage.array('files', 10), mediaController.upload);
router.patch('/:id', validate(updateMediaSchema), mediaController.update);
router.patch('/:id/restore', mediaController.restore);
router.delete('/:id', mediaController.remove);
router.post('/bulk-delete', mediaController.bulkRemove);

export default router;
