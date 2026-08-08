import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { seoSchema } from './schemas/seo.schema.js';
import { imageSchema } from './schemas/image.schema.js';

const siteSettingSchema = new Schema(
  {
    // Fixed value + unique index enforces a single document (singleton pattern).
    singletonKey: { type: String, default: 'site_settings', unique: true, immutable: true },
    siteName: { type: String, required: true, trim: true },
    tagline: { type: String, trim: true },
    logo: imageSchema,
    favicon: imageSchema,
    themeColors: {
      primary: { type: String, trim: true },
      secondary: { type: String, trim: true },
      accent: { type: String, trim: true },
      background: { type: String, trim: true },
      text: { type: String, trim: true },
    },
    contact: {
      phones: [{ type: String, trim: true }],
      whatsapp: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      addressLine: { type: String, trim: true },
    },
    businessHours: { type: String, trim: true },
    seoDefaults: seoSchema,
    analytics: {
      googleAnalyticsId: { type: String, trim: true },
      googleTagManagerId: { type: String, trim: true },
      metaPixelId: { type: String, trim: true },
    },
    recaptchaSiteKey: { type: String, trim: true },
    maintenanceMode: {
      enabled: { type: Boolean, default: false },
      message: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

siteSettingSchema.plugin(auditablePlugin);

export default model('SiteSetting', siteSettingSchema);
