import { Schema, model } from 'mongoose';
import validator from 'validator';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { JOB_APPLICATION_STATUSES } from '../constants/enums.js';

const fileSchema = new Schema(
  { url: { type: String, required: true }, publicId: { type: String }, filename: { type: String } },
  { _id: false }
);

// Applicants against a Career opening — distinct from RiderApplication, which
// captures leads for the core "become a rider" business funnel.
const jobApplicationSchema = new Schema(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Career', required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    phone: { type: String, required: true, trim: true },
    resume: { type: fileSchema, required: true },
    coverLetter: { type: String, trim: true },
    linkedinUrl: { type: String, trim: true },
    portfolioUrl: { type: String, trim: true },
    status: { type: String, enum: JOB_APPLICATION_STATUSES, default: 'applied', index: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

jobApplicationSchema.plugin(auditablePlugin);

jobApplicationSchema.index({ job: 1, status: 1 });
jobApplicationSchema.index({ email: 1 });

export default model('JobApplication', jobApplicationSchema);
