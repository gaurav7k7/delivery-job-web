import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { imageSchema } from './schemas/image.schema.js';

const teamSocialLinkSchema = new Schema(
  { platform: { type: String, trim: true }, url: { type: String, trim: true } },
  { _id: false }
);

const teamMemberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    department: { type: String, trim: true },
    bio: { type: String, trim: true },
    photo: imageSchema,
    socialLinks: [teamSocialLinkSchema],
    order: { type: Number, default: 0 },
    isLeadership: { type: Boolean, default: false },
  },
  { timestamps: true }
);

teamMemberSchema.plugin(auditablePlugin);

teamMemberSchema.index({ isLeadership: 1, order: 1 });

export default model('TeamMember', teamMemberSchema);
