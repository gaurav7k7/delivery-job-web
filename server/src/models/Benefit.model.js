import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';

const benefitSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    icon: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

benefitSchema.plugin(auditablePlugin);

benefitSchema.index({ order: 1 });

export default model('Benefit', benefitSchema);
