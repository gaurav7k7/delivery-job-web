import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { imageSchema } from './schemas/image.schema.js';

const clientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: imageSchema, required: true },
    websiteUrl: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

clientSchema.plugin(auditablePlugin);

clientSchema.index({ order: 1 });

export default model('Client', clientSchema);
