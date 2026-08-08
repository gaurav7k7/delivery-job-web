import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';

const officeSchema = new Schema(
  {
    branchName: { type: String, required: true, trim: true },
    addressLine: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    phones: [{ type: String, trim: true }],
    email: { type: String, trim: true, lowercase: true },
    mapUrl: { type: String, trim: true },
    lat: { type: Number },
    lng: { type: Number },
    isHeadOffice: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

officeSchema.plugin(auditablePlugin);

officeSchema.index({ city: 1 });
officeSchema.index({ order: 1 });

export default model('Office', officeSchema);
