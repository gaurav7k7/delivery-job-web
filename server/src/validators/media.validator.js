import { z } from 'zod';

export const updateMediaSchema = z.object({
  body: z.object({
    altText: z.string().trim().optional(),
    tags: z.array(z.string().trim().toLowerCase()).optional(),
    folder: z.string().trim().optional(),
  }),
});
