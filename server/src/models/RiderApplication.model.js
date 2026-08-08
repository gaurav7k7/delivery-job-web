import { Schema, model } from 'mongoose';
import validator from 'validator';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { VEHICLE_TYPES, RIDER_APPLICATION_STATUSES } from '../constants/enums.js';

// Core business conversion object: the "Apply Now / Become a Rider" lead capture.
const riderApplicationSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v) => validator.isMobilePhone(v, 'en-IN'),
        message: 'Please provide a valid Indian phone number',
      },
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v) => !v || validator.isEmail(v),
        message: 'Please provide a valid email address',
      },
    },
    city: { type: String, required: true, trim: true, index: true },
    preferredPlatforms: [{ type: Schema.Types.ObjectId, ref: 'Platform' }],
    vehicleType: { type: String, enum: VEHICLE_TYPES },
    hasDrivingLicense: { type: Boolean, default: false },
    hasDocuments: { type: Boolean, default: false },
    status: { type: String, enum: RIDER_APPLICATION_STATUSES, default: 'new', index: true },
    source: { type: String, trim: true, default: 'website' },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

riderApplicationSchema.plugin(auditablePlugin);

riderApplicationSchema.index({ status: 1, createdAt: -1 });
riderApplicationSchema.index({ phone: 1 });

export default model('RiderApplication', riderApplicationSchema);
