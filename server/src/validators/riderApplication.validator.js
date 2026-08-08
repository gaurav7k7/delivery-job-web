import { z } from 'zod';
import { objectId } from './shared.validator.js';
import { VEHICLE_TYPES, RIDER_APPLICATION_STATUSES } from '../constants/enums.js';

export const createRiderApplicationSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(2).max(150),
    phone: z.string().trim().min(6).max(20),
    email: z.string().trim().email('Please provide a valid email address').optional(),
    city: z.string().trim().min(1),
    preferredPlatforms: z.array(objectId).optional(),
    vehicleType: z.enum(VEHICLE_TYPES).optional(),
    hasDrivingLicense: z.boolean().optional(),
    hasDocuments: z.boolean().optional(),
    source: z.string().trim().optional(),
  }),
});

export const updateRiderApplicationSchema = z.object({
  body: z.object({
    status: z.enum(RIDER_APPLICATION_STATUSES).optional(),
    notes: z.string().trim().optional(),
  }),
});
