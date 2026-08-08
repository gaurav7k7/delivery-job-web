import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { MEDIA_TYPES } from '../constants/enums.js';

const mediaSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, trim: true, unique: true },
    type: { type: String, required: true, enum: MEDIA_TYPES },
    format: { type: String, trim: true },
    sizeBytes: { type: Number },
    width: { type: Number },
    height: { type: Number },
    altText: { type: String, trim: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    folder: { type: String, trim: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

mediaSchema.plugin(auditablePlugin);

mediaSchema.index({ type: 1, folder: 1 });
mediaSchema.index({ tags: 1 });

export default model('Media', mediaSchema);
