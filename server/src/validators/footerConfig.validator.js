import { z } from 'zod';

const footerLinkSchema = z.object({
  label: z.string().trim().min(1),
  url: z.string().trim().min(1),
  order: z.number().optional(),
  isExternal: z.boolean().optional(),
});

const footerColumnSchema = z.object({
  title: z.string().trim().min(1),
  links: z.array(footerLinkSchema).optional(),
  order: z.number().optional(),
});

export const updateFooterConfigSchema = z.object({
  body: z.object({
    columns: z.array(footerColumnSchema).optional(),
    bottomText: z.string().trim().optional(),
    disclaimerText: z.string().trim().optional(),
    newsletterEnabled: z.boolean().optional(),
  }),
});
