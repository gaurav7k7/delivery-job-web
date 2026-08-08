import { z } from 'zod';
import { imageSchema } from './shared.validator.js';

const ctaSchema = z.object({
  label: z.string().trim().optional(),
  url: z.string().trim().optional(),
});

export const createHeroBannerSchema = z.object({
  body: z.object({
    page: z.string().trim().toLowerCase().min(1),
    title: z.string().trim().min(1),
    subtitle: z.string().trim().optional(),
    description: z.string().trim().optional(),
    image: imageSchema,
    mobileImage: imageSchema.optional(),
    ctaPrimary: ctaSchema.optional(),
    ctaSecondary: ctaSchema.optional(),
    order: z.number().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  }),
});

export const updateHeroBannerSchema = z.object({
  body: z.object({
    page: z.string().trim().toLowerCase().min(1).optional(),
    title: z.string().trim().min(1).optional(),
    subtitle: z.string().trim().optional(),
    description: z.string().trim().optional(),
    image: imageSchema.optional(),
    mobileImage: imageSchema.optional(),
    ctaPrimary: ctaSchema.optional(),
    ctaSecondary: ctaSchema.optional(),
    order: z.number().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  }),
});
