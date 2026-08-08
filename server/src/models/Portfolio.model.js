import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { attachSlug } from '../utils/slugify.js';
import { seoSchema } from './schemas/seo.schema.js';
import { imageSchema } from './schemas/image.schema.js';

const metricSchema = new Schema({ label: { type: String, trim: true }, value: { type: String, trim: true } }, { _id: false });

const portfolioSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, lowercase: true },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    industry: { type: Schema.Types.ObjectId, ref: 'Industry' },
    service: { type: Schema.Types.ObjectId, ref: 'Service' },
    coverImage: { type: imageSchema, required: true },
    gallery: [imageSchema],
    summary: { type: String, required: true, trim: true },
    challenge: { type: String, trim: true },
    solution: { type: String, trim: true },
    results: { type: String, trim: true },
    metrics: [metricSchema],
    projectUrl: { type: String, trim: true },
    completedAt: { type: Date },
    order: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    seo: seoSchema,
  },
  { timestamps: true }
);

attachSlug(portfolioSchema, 'title');
portfolioSchema.plugin(auditablePlugin);

portfolioSchema.index({ slug: 1 }, { unique: true });
portfolioSchema.index({ industry: 1, service: 1 });
portfolioSchema.index({ order: 1 });

export default model('Portfolio', portfolioSchema);
