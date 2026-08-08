import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { imageSchema } from './schemas/image.schema.js';

const testimonialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, trim: true },
    city: { type: String, trim: true, index: true },
    platform: { type: Schema.Types.ObjectId, ref: 'Platform' },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    avatar: imageSchema,
    isApproved: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

testimonialSchema.plugin(auditablePlugin);

testimonialSchema.index({ isApproved: 1, isFeatured: 1, order: 1 });

export default model('Testimonial', testimonialSchema);
