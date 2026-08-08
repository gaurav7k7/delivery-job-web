import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';

const processStepSchema = new Schema(
  {
    page: { type: String, required: true, trim: true, lowercase: true, default: 'how-it-works' },
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    icon: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

processStepSchema.plugin(auditablePlugin);

processStepSchema.index({ page: 1, stepNumber: 1 }, { unique: true });

export default model('ProcessStep', processStepSchema);
