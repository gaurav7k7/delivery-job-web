import { z } from 'zod';
import { imageSchema } from './shared.validator.js';

const fileSchema = z.object({
  url: z.string().trim().optional(),
  publicId: z.string().trim().optional(),
});

export const createCertificateSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(200),
    issuer: z.string().trim().optional(),
    issuedDate: z.coerce.date().optional(),
    expiryDate: z.coerce.date().optional(),
    certificateFile: fileSchema.optional(),
    image: imageSchema.optional(),
    order: z.number().optional(),
  }),
});

export const updateCertificateSchema = z.object({ body: createCertificateSchema.shape.body.partial() });
