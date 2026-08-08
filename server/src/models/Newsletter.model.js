import { Schema, model } from 'mongoose';
import validator from 'validator';
import { auditablePlugin } from './plugins/auditable.plugin.js';

const newsletterSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    isSubscribed: { type: Boolean, default: true, index: true },
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: { type: Date },
    source: { type: String, trim: true, default: 'website' },
  },
  { timestamps: true }
);

newsletterSchema.plugin(auditablePlugin);

export default model('Newsletter', newsletterSchema);
