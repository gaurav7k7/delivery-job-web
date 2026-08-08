import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { seoSchema } from './schemas/seo.schema.js';

// Section content itself lives in its own collection (Service, Testimonial, ...);
// this document only controls which sections render, in what order, and with
// what per-section display settings — giving the admin full homepage layout control.
const sectionSchema = new Schema(
  {
    key: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, required: true },
    settings: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const homepageSchema = new Schema(
  {
    singletonKey: { type: String, default: 'homepage', unique: true, immutable: true },
    sections: [sectionSchema],
    seo: seoSchema,
  },
  { timestamps: true }
);

homepageSchema.plugin(auditablePlugin);

export default model('Homepage', homepageSchema);
