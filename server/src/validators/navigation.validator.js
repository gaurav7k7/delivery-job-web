import { z } from 'zod';
import { NAV_LOCATIONS } from '../constants/enums.js';

const baseNavItemFields = {
  label: z.string().trim().min(1),
  url: z.string().trim().min(1),
  icon: z.string().trim().optional(),
  order: z.number().optional(),
  isExternal: z.boolean().optional(),
  openInNewTab: z.boolean().optional(),
  isActive: z.boolean().optional(),
};

// Nav items can nest (dropdown menus), mirroring the self-referencing
// `children` field on models/Navigation.model.js.
const navItemSchema = z.lazy(() =>
  z.object({
    ...baseNavItemFields,
    children: z.array(navItemSchema).optional(),
  })
);

export const createNavigationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    location: z.enum(NAV_LOCATIONS),
    items: z.array(navItemSchema).optional(),
  }),
});

export const updateNavigationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120).optional(),
    location: z.enum(NAV_LOCATIONS).optional(),
    items: z.array(navItemSchema).optional(),
  }),
});
