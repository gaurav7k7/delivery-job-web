import { z } from 'zod';
import { SOCIAL_PLATFORMS } from '../constants/enums.js';

export const createSocialLinkSchema = z.object({
  body: z.object({
    platform: z.enum(SOCIAL_PLATFORMS),
    url: z.string().trim().url('Please provide a valid URL'),
    icon: z.string().trim().optional(),
    order: z.number().optional(),
  }),
});

export const updateSocialLinkSchema = z.object({
  body: z.object({
    platform: z.enum(SOCIAL_PLATFORMS).optional(),
    url: z.string().trim().url('Please provide a valid URL').optional(),
    icon: z.string().trim().optional(),
    order: z.number().optional(),
  }),
});
