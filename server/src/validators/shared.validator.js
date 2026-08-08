import { z } from 'zod';

// Reused by every module validator that references another document (role,
// permission, category, etc.) — Mongo ObjectId as a 24-char hex string.
export const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

// Mirrors models/schemas/image.schema.js — shared by every module that
// embeds an uploaded image (logo, favicon, hero image, cover image, ...).
export const imageSchema = z.object({
  url: z.string().trim().min(1, 'Image URL is required'),
  publicId: z.string().trim().optional(),
  alt: z.string().trim().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

// Mirrors models/schemas/seo.schema.js — shared by every module with
// per-record SEO overrides.
export const seoSchema = z.object({
  metaTitle: z.string().trim().max(70).optional(),
  metaDescription: z.string().trim().max(160).optional(),
  metaKeywords: z.array(z.string().trim().toLowerCase()).optional(),
  ogImage: z.string().trim().optional(),
  canonicalUrl: z.string().trim().optional(),
  noIndex: z.boolean().optional(),
});
