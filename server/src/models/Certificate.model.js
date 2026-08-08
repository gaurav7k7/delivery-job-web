import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { imageSchema } from './schemas/image.schema.js';

const certificateSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, trim: true },
    issuedDate: { type: Date },
    expiryDate: { type: Date },
    certificateFile: { url: { type: String, trim: true }, publicId: { type: String, trim: true } },
    image: imageSchema,
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

certificateSchema.plugin(auditablePlugin);

certificateSchema.index({ order: 1 });

export default model('Certificate', certificateSchema);
