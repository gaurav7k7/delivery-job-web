import { z } from 'zod';

export const subscribeNewsletterSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Please provide a valid email address'),
  }),
});

export const unsubscribeNewsletterSchema = subscribeNewsletterSchema;
