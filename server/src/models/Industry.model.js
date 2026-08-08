import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { attachSlug } from '../utils/slugify.js';
import { seoSchema } from './schemas/seo.schema.js';
import { imageSchema } from './schemas/image.schema.js';

const industrySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, trim: true, lowercase: true },
    icon: { type: String, trim: true },
    description: { type: String, trim: true },
    image: imageSchema,
    order: { type: Number, default: 0 },
    seo: seoSchema,
  },
  { timestamps: true }
);

attachSlug(industrySchema, 'name');
industrySchema.plugin(auditablePlugin);

industrySchema.index({ slug: 1 }, { unique: true });
industrySchema.index({ order: 1 });

export default model('Industry', industrySchema);
