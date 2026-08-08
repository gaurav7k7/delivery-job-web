import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';

const footerLinkSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    isExternal: { type: Boolean, default: false },
  },
  { _id: false }
);

const footerColumnSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    links: [footerLinkSchema],
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const footerConfigSchema = new Schema(
  {
    singletonKey: { type: String, default: 'footer_config', unique: true, immutable: true },
    columns: [footerColumnSchema],
    bottomText: { type: String, trim: true },
    disclaimerText: { type: String, trim: true },
    newsletterEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

footerConfigSchema.plugin(auditablePlugin);

export default model('FooterConfig', footerConfigSchema);
