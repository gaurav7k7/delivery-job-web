import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';

// Files never touch local disk — multer keeps them in memory (see
// upload.middleware.js) and this pipes the buffer straight to Cloudinary.
export function uploadBuffer(buffer, { folder, resourceType = 'auto', publicId } = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType, public_id: publicId },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

export async function destroyAsset(publicId, resourceType = 'image') {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}
