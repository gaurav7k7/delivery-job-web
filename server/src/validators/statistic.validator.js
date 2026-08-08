import { z } from 'zod';

export const createStatisticSchema = z.object({
  body: z.object({
    label: z.string().trim().min(1),
    value: z.number(),
    prefix: z.string().trim().optional(),
    suffix: z.string().trim().optional(),
    icon: z.string().trim().optional(),
    order: z.number().optional(),
  }),
});

export const updateStatisticSchema = z.object({ body: createStatisticSchema.shape.body.partial() });
