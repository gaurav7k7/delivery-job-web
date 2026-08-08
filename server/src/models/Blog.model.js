import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { attachSlug } from '../utils/slugify.js';
import { seoSchema } from './schemas/seo.schema.js';
import { imageSchema } from './schemas/image.schema.js';
import { BLOG_STATUSES } from '../constants/enums.js';

const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, lowercase: true },
    excerpt: { type: String, required: true, trim: true, maxlength: 300 },
    content: { type: String, required: true },
    coverImage: { type: imageSchema, required: true },
    gallery: [imageSchema],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true, trim: true, lowercase: true, index: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    status: { type: String, enum: BLOG_STATUSES, default: 'draft', index: true },
    publishedAt: { type: Date },
    readTimeMinutes: { type: Number },
    views: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    seo: seoSchema,
  },
  { timestamps: true }
);

attachSlug(blogSchema, 'title');
blogSchema.plugin(auditablePlugin);

blogSchema.index({ slug: 1 }, { unique: true });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

export default model('Blog', blogSchema);
