import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { attachSlug } from '../utils/slugify.js';
import { seoSchema } from './schemas/seo.schema.js';
import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS, CAREER_STATUSES } from '../constants/enums.js';

const salaryRangeSchema = new Schema(
  {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'INR' },
    isDisclosed: { type: Boolean, default: false },
  },
  { _id: false }
);

const careerSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, lowercase: true },
    department: { type: String, required: true, trim: true, index: true },
    location: { type: String, required: true, trim: true },
    employmentType: { type: String, required: true, enum: EMPLOYMENT_TYPES },
    experienceLevel: { type: String, enum: EXPERIENCE_LEVELS },
    description: { type: String, required: true },
    responsibilities: [{ type: String, trim: true }],
    requirements: [{ type: String, trim: true }],
    salaryRange: salaryRangeSchema,
    applicationDeadline: { type: Date },
    status: { type: String, enum: CAREER_STATUSES, default: 'open', index: true },
    seo: seoSchema,
  },
  { timestamps: true }
);

attachSlug(careerSchema, 'title');
careerSchema.plugin(auditablePlugin);

careerSchema.index({ slug: 1 }, { unique: true });
careerSchema.index({ status: 1, department: 1 });

export default model('Career', careerSchema);
