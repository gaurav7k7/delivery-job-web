import { Schema } from 'mongoose';

export const imageSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, trim: true },
    alt: { type: String, trim: true, default: '' },
    width: { type: Number },
    height: { type: Number },
  },
  { _id: false }
);
