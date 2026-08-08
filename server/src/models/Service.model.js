import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { attachSlug } from '../utils/slugify.js';
import { seoSchema } from './schemas/seo.schema.js';
import { imageSchema } from './schemas/image.schema.js';

const serviceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, lowercase: true },
    icon: { type: String, trim: true },
    shortDescription: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true },
    features: [{ type: String, trim: true }],
    image: imageSchema,
    industries: [{ type: Schema.Types.ObjectId, ref: 'Industry' }],
    order: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    seo: seoSchema,
  },
  { timestamps: true }
);

attachSlug(serviceSchema, 'title');
serviceSchema.plugin(auditablePlugin);

serviceSchema.index({ slug: 1 }, { unique: true });
serviceSchema.index({ isActive: 1, isDeleted: 1, order: 1 });
serviceSchema.index({ title: 'text', shortDescription: 'text' });

export default model('Service', serviceSchema);
