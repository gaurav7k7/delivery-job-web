import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { imageSchema } from './schemas/image.schema.js';

const ctaSchema = new Schema({ label: { type: String, trim: true }, url: { type: String, trim: true } }, { _id: false });

const heroBannerSchema = new Schema(
  {
    page: { type: String, required: true, trim: true, lowercase: true, index: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    description: { type: String, trim: true },
    image: { type: imageSchema, required: true },
    mobileImage: imageSchema,
    ctaPrimary: ctaSchema,
    ctaSecondary: ctaSchema,
    order: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

heroBannerSchema.plugin(auditablePlugin);

heroBannerSchema.index({ page: 1, order: 1, isActive: 1 });

export default model('HeroBanner', heroBannerSchema);
