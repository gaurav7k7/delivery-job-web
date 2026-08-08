import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';

const faqSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    category: { type: String, trim: true, lowercase: true, default: 'general', index: true },
    page: { type: String, trim: true, lowercase: true, default: 'general', index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

faqSchema.plugin(auditablePlugin);

faqSchema.index({ page: 1, category: 1, order: 1 });

export default model('FAQ', faqSchema);
