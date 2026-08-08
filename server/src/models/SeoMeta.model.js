import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { seoSchema } from './schemas/seo.schema.js';

// Route-level SEO overrides for pages that have no entity of their own
// (e.g. "/", "/apply", "/404"). Entity-bearing collections (Service, Blog,
// Portfolio, ...) carry their own embedded `seo` field for their detail pages.
const seoMetaSchema = new Schema(
  {
    route: { type: String, required: true, trim: true, lowercase: true, unique: true },
    seo: { type: seoSchema, required: true },
    structuredData: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

seoMetaSchema.plugin(auditablePlugin);

export default model('SeoMeta', seoMetaSchema);
