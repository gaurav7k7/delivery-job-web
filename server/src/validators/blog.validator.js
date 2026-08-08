import { z } from 'zod';
import { imageSchema, seoSchema, objectId } from './shared.validator.js';
import { BLOG_STATUSES } from '../constants/enums.js';

export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2).max(200),
    slug: z.string().trim().toLowerCase().optional(),
    excerpt: z.string().trim().min(2).max(300),
    content: z.string().trim().min(1),
    coverImage: imageSchema,
    gallery: z.array(imageSchema).optional(),
    author: objectId.optional(), // defaults to the authenticated admin if omitted
    category: z.string().trim().toLowerCase().min(1),
    tags: z.array(z.string().trim().toLowerCase()).optional(),
    status: z.enum(BLOG_STATUSES).optional(),
    readTimeMinutes: z.number().optional(),
    isFeatured: z.boolean().optional(),
    seo: seoSchema.optional(),
  }),
});

export const updateBlogSchema = z.object({ body: createBlogSchema.shape.body.partial() });
