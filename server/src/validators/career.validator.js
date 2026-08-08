import { z } from 'zod';
import { seoSchema } from './shared.validator.js';
import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS, CAREER_STATUSES } from '../constants/enums.js';

const salaryRangeSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  currency: z.string().trim().optional(),
  isDisclosed: z.boolean().optional(),
});

export const createCareerSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2).max(150),
    slug: z.string().trim().toLowerCase().optional(),
    department: z.string().trim().min(1),
    location: z.string().trim().min(1),
    employmentType: z.enum(EMPLOYMENT_TYPES),
    experienceLevel: z.enum(EXPERIENCE_LEVELS).optional(),
    description: z.string().trim().min(1),
    responsibilities: z.array(z.string().trim()).optional(),
    requirements: z.array(z.string().trim()).optional(),
    salaryRange: salaryRangeSchema.optional(),
    applicationDeadline: z.coerce.date().optional(),
    status: z.enum(CAREER_STATUSES).optional(),
    seo: seoSchema.optional(),
  }),
});

export const updateCareerSchema = z.object({ body: createCareerSchema.shape.body.partial() });
