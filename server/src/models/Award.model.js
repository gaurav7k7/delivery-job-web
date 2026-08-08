import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { imageSchema } from './schemas/image.schema.js';

const awardSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, trim: true },
    year: { type: Number },
    image: imageSchema,
    description: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

awardSchema.plugin(auditablePlugin);

awardSchema.index({ year: -1, order: 1 });

export default model('Award', awardSchema);
