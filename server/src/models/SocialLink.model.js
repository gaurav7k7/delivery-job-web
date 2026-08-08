import { Schema, model } from 'mongoose';
import validator from 'validator';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { SOCIAL_PLATFORMS } from '../constants/enums.js';

const socialLinkSchema = new Schema(
  {
    platform: { type: String, required: true, enum: SOCIAL_PLATFORMS },
    url: {
      type: String,
      required: true,
      trim: true,
      validate: [validator.isURL, 'Please provide a valid URL'],
    },
    icon: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

socialLinkSchema.plugin(auditablePlugin);

socialLinkSchema.index({ platform: 1, url: 1 }, { unique: true });
socialLinkSchema.index({ order: 1 });

export default model('SocialLink', socialLinkSchema);
