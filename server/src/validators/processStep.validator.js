import { z } from 'zod';

export const createProcessStepSchema = z.object({
  body: z.object({
    page: z.string().trim().toLowerCase().optional(),
    stepNumber: z.number().int().positive(),
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    icon: z.string().trim().optional(),
    order: z.number().optional(),
  }),
});

export const updateProcessStepSchema = z.object({ body: createProcessStepSchema.shape.body.partial() });
