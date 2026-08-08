import { z } from 'zod';
import { objectId } from './shared.validator.js';
import { JOB_APPLICATION_STATUSES } from '../constants/enums.js';

// multipart/form-data body — multer parses the resume file separately onto
// req.file, so this only validates the accompanying text fields.
export const createJobApplicationSchema = z.object({
  body: z.object({
    job: objectId,
    fullName: z.string().trim().min(2).max(150),
    email: z.string().trim().email('Please provide a valid email address'),
    phone: z.string().trim().min(6).max(20),
    coverLetter: z.string().trim().optional(),
    linkedinUrl: z.string().trim().optional(),
    portfolioUrl: z.string().trim().optional(),
  }),
});

export const updateJobApplicationSchema = z.object({
  body: z.object({
    status: z.enum(JOB_APPLICATION_STATUSES).optional(),
    notes: z.string().trim().optional(),
  }),
});
