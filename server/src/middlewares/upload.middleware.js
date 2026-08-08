import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(ApiError.badRequest(`Unsupported file type: ${file.mimetype}`));
  }
  cb(null, true);
}

// Memory storage — files are streamed straight to Cloudinary by the service
// layer, never written to local disk.
export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
});

const ALLOWED_DOCUMENT_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

function documentFileFilter(req, file, cb) {
  if (!ALLOWED_DOCUMENT_MIME_TYPES.has(file.mimetype)) {
    return cb(ApiError.badRequest(`Unsupported file type: ${file.mimetype}. Please upload a PDF or Word document.`));
  }
  cb(null, true);
}

// Used by public submission forms that attach a document (resume, ID proof).
export const uploadDocument = multer({
  storage,
  fileFilter: documentFileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});
