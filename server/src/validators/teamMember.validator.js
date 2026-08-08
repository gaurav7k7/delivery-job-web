import { z } from 'zod';
import { imageSchema } from './shared.validator.js';

const socialLinkSchema = z.object({
  platform: z.string().trim().optional(),
  url: z.string().trim().optional(),
});

export const createTeamMemberSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(150),
    designation: z.string().trim().min(1).max(150),
    department: z.string().trim().optional(),
    bio: z.string().trim().optional(),
    photo: imageSchema.optional(),
    socialLinks: z.array(socialLinkSchema).optional(),
    order: z.number().optional(),
    isLeadership: z.boolean().optional(),
  }),
});

export const updateTeamMemberSchema = z.object({ body: createTeamMemberSchema.shape.body.partial() });
