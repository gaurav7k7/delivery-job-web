import { z } from 'zod';
import { seoSchema } from './shared.validator.js';

const sectionSchema = z.object({
  key: z.string().trim().min(1),
  title: z.string().trim().optional(),
  isVisible: z.boolean().optional(),
  order: z.number(),
  settings: z.record(z.string(), z.any()).optional(),
});

export const updateHomepageSchema = z.object({
  body: z.object({
    sections: z.array(sectionSchema).optional(),
    seo: seoSchema.optional(),
  }),
});
