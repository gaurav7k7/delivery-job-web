import { z } from 'zod';

export const createBenefitSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    icon: z.string().trim().optional(),
    order: z.number().optional(),
  }),
});

export const updateBenefitSchema = z.object({ body: createBenefitSchema.shape.body.partial() });
