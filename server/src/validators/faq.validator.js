import { z } from 'zod';

export const createFaqSchema = z.object({
  body: z.object({
    question: z.string().trim().min(2),
    answer: z.string().trim().min(2),
    category: z.string().trim().toLowerCase().optional(),
    page: z.string().trim().toLowerCase().optional(),
    order: z.number().optional(),
  }),
});

export const updateFaqSchema = z.object({ body: createFaqSchema.shape.body.partial() });
