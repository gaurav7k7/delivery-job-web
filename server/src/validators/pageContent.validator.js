import { z } from 'zod';
import { imageSchema, seoSchema } from './shared.validator.js';

export const createPageContentSchema = z.object({
  body: z.object({
    pageSlug: z.string().trim().toLowerCase().min(1),
    sectionKey: z.string().trim().toLowerCase().min(1),
    title: z.string().trim().optional(),
    subtitle: z.string().trim().optional(),
    body: z.string().trim().optional(),
    media: z.array(imageSchema).optional(),
    order: z.number().optional(),
    seo: seoSchema.optional(),
  }),
});

export const updatePageContentSchema = z.object({
  body: z.object({
    pageSlug: z.string().trim().toLowerCase().min(1).optional(),
    sectionKey: z.string().trim().toLowerCase().min(1).optional(),
    title: z.string().trim().optional(),
    subtitle: z.string().trim().optional(),
    body: z.string().trim().optional(),
    media: z.array(imageSchema).optional(),
    order: z.number().optional(),
    seo: seoSchema.optional(),
  }),
});
