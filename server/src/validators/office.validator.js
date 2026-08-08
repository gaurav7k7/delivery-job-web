import { z } from 'zod';

export const createOfficeSchema = z.object({
  body: z.object({
    branchName: z.string().trim().min(1).max(150),
    addressLine: z.string().trim().min(1),
    city: z.string().trim().min(1),
    state: z.string().trim().min(1),
    pincode: z.string().trim().min(1),
    phones: z.array(z.string().trim()).optional(),
    email: z.string().trim().email().optional().or(z.literal('')),
    mapUrl: z.string().trim().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    isHeadOffice: z.boolean().optional(),
    order: z.number().optional(),
  }),
});

export const updateOfficeSchema = z.object({ body: createOfficeSchema.shape.body.partial() });
