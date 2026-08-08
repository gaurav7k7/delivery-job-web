import { z } from 'zod';
import { imageSchema, objectId } from './shared.validator.js';

// Public submission — moderation fields (isApproved/isFeatured/order) are
// deliberately absent so a submitter can never self-approve.
export const createTestimonialSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(150),
    designation: z.string().trim().optional(),
    city: z.string().trim().optional(),
    platform: objectId.optional(),
    message: z.string().trim().min(2).max(1000),
    rating: z.number().min(1).max(5).optional(),
    avatar: imageSchema.optional(),
  }),
});

export const updateTestimonialSchema = z.object({
  body: createTestimonialSchema.shape.body
    .extend({
      isApproved: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      order: z.number().optional(),
    })
    .partial(),
});
