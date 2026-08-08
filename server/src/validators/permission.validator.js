import { z } from 'zod';

export const createPermissionSchema = z.object({
  body: z.object({
    key: z.string().trim().toLowerCase().min(3),
    module: z.string().trim().toLowerCase().min(2),
    action: z.enum(['create', 'read', 'update', 'delete', 'publish', 'manage']),
    description: z.string().trim().max(300).optional(),
  }),
});

// key/module/action are load-bearing for authorize() checks elsewhere and
// for role assignments — only the description is safe to edit post-creation.
export const updatePermissionSchema = z.object({
  body: z.object({
    description: z.string().trim().max(300).optional(),
  }),
});
