import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { seoSchema } from './schemas/seo.schema.js';
import { imageSchema } from './schemas/image.schema.js';

// Generic freeform content blocks for static pages that have no dedicated
// collection of their own (About, Contact, Apply, Privacy Policy, Terms, ...).
const pageContentSchema = new Schema(
  {
    pageSlug: { type: String, required: true, trim: true, lowercase: true, index: true },
    sectionKey: { type: String, required: true, trim: true, lowercase: true },
    title: { type: String, trim: true },
    subtitle: { type: String, trim: true },
    body: { type: String, trim: true },
    media: [imageSchema],
    order: { type: Number, default: 0 },
    seo: seoSchema,
  },
  { timestamps: true }
);

pageContentSchema.plugin(auditablePlugin);

pageContentSchema.index({ pageSlug: 1, sectionKey: 1 }, { unique: true });

export default model('PageContent', pageContentSchema);
