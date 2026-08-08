import { Schema } from 'mongoose';

export const seoSchema = new Schema(
  {
    metaTitle: { type: String, trim: true, maxlength: 70 },
    metaDescription: { type: String, trim: true, maxlength: 160 },
    metaKeywords: [{ type: String, trim: true, lowercase: true }],
    ogImage: { type: String, trim: true },
    canonicalUrl: { type: String, trim: true },
    noIndex: { type: Boolean, default: false },
  },
  { _id: false }
);
