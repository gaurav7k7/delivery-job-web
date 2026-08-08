import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { attachSlug } from '../utils/slugify.js';
import { imageSchema } from './schemas/image.schema.js';

// Delivery/gig platforms Zerivon onboards riders onto (Uber, Swiggy, Zomato, ...).
// Core preserved business content from the original site.
const platformSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, trim: true, lowercase: true },
    logo: { type: imageSchema, required: true },
    brandColor: { type: String, trim: true },
    description: { type: String, trim: true },
    benefits: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

attachSlug(platformSchema, 'name');
platformSchema.plugin(auditablePlugin);

platformSchema.index({ slug: 1 }, { unique: true });
platformSchema.index({ order: 1 });

export default model('Platform', platformSchema);
