import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { NAV_LOCATIONS } from '../constants/enums.js';

const navItemSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    icon: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isExternal: { type: Boolean, default: false },
    openInNewTab: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

// Self-referencing embed to support nested/dropdown menus.
navItemSchema.add({ children: [navItemSchema] });

const navigationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    location: { type: String, required: true, enum: NAV_LOCATIONS },
    items: [navItemSchema],
  },
  { timestamps: true }
);

navigationSchema.plugin(auditablePlugin);

navigationSchema.index({ location: 1 });

export default model('Navigation', navigationSchema);
