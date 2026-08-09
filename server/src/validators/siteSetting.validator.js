import { z } from "zod";
import { imageSchema, seoSchema } from "./shared.validator.js";

export const updateSiteSettingSchema = z.object({
  body: z.object({
    siteName: z.string().trim().min(2).max(120).optional(),
    tagline: z.string().trim().max(200).optional(),
    logo: imageSchema.nullable().optional(),
    favicon: imageSchema.nullable().optional(),
    themeColors: z
      .object({
        primary: z.string().trim().optional(),
        secondary: z.string().trim().optional(),
        accent: z.string().trim().optional(),
        background: z.string().trim().optional(),
        text: z.string().trim().optional(),
      })
      .optional(),
    contact: z
      .object({
        phones: z.array(z.string().trim()).optional(),
        whatsapp: z.string().trim().optional(),
        email: z.string().trim().email().optional().or(z.literal("")),
        addressLine: z.string().trim().optional(),
      })
      .optional(),
    businessHours: z.string().trim().optional(),
    seoDefaults: seoSchema.optional(),
    analytics: z
      .object({
        googleAnalyticsId: z.string().trim().optional(),
        googleTagManagerId: z.string().trim().optional(),
        metaPixelId: z.string().trim().optional(),
      })
      .optional(),
    recaptchaSiteKey: z.string().trim().optional(),
    maintenanceMode: z
      .object({
        enabled: z.boolean().optional(),
        message: z.string().trim().optional(),
      })
      .optional(),
  }),
});
