import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';

const statisticSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: Number, required: true },
    prefix: { type: String, trim: true },
    suffix: { type: String, trim: true },
    icon: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

statisticSchema.plugin(auditablePlugin);

statisticSchema.index({ order: 1 });

export default model('Statistic', statisticSchema);
