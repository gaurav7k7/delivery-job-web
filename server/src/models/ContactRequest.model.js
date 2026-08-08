import { Schema, model } from 'mongoose';
import validator from 'validator';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { CONTACT_REQUEST_STATUSES } from '../constants/enums.js';

const contactRequestSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    phone: { type: String, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: CONTACT_REQUEST_STATUSES, default: 'unread', index: true },
    respondedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    respondedAt: { type: Date },
    source: { type: String, trim: true, default: 'website' },
  },
  { timestamps: true }
);

contactRequestSchema.plugin(auditablePlugin);

contactRequestSchema.index({ status: 1, createdAt: -1 });

export default model('ContactRequest', contactRequestSchema);
