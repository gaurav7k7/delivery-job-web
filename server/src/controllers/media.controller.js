import { mediaRepository } from '../repositories/media.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { Media } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { uploadBuffer } from '../services/cloudinary.service.js';
import { invalidateCache } from '../middlewares/cache.middleware.js';

const base = createCrudController(mediaRepository, 'Media', 'media');

export const list = base.list;
export const getOne = base.getOne;
export const update = base.update;
// Soft-delete only — other modules store a Media asset's URL by value (no
// referential integrity back to this collection), so hard-deleting from
// Cloudinary here could silently break images already published elsewhere.
export const remove = base.remove;
export const restore = base.restore;
export const bulkRemove = base.bulkRemove;

export const upload = async (req, res) => {
  const files = req.files && req.files.length > 0 ? req.files : req.file ? [req.file] : [];
  if (files.length === 0) throw ApiError.badRequest('At least one file is required');

  const folder = req.body.folder ? String(req.body.folder).trim() : 'zerivon/media';

  const uploaded = await Promise.all(
    files.map(async (file) => {
      const result = await uploadBuffer(file.buffer, { folder, resourceType: 'image' });
      return Media.create({
        url: result.secure_url,
        publicId: result.public_id,
        type: 'image',
        format: result.format,
        sizeBytes: result.bytes,
        width: result.width,
        height: result.height,
        folder,
        uploadedBy: req.user.id,
        createdBy: req.user.id,
        updatedBy: req.user.id,
      });
    })
  );

  await invalidateCache('media');
  return new ApiResponse(201, uploaded, 'File(s) uploaded').send(res);
};

export const listFolders = async (req, res) => {
  const folders = await Media.distinct('folder', { isDeleted: false });
  return new ApiResponse(200, folders.filter(Boolean).sort()).send(res);
};
