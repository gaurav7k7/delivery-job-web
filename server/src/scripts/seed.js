import 'dotenv/config';
import crypto from 'node:crypto';
import { connectDB, disconnectDB } from '../config/db.js';
import { Permission, Role, User } from '../models/index.js';
import { env } from '../config/env.js';

// One `<module>:manage` permission per admin module. New modules append here
// as they're built — re-running this script is safe (everything upserts).
const MODULES = [
  'users',
  'roles',
  'permissions',
  'activity-logs',
  'settings',
  'navigation',
  'footer',
  'social-links',
  'seo',
  'homepage',
  'hero-banners',
  'page-content',
  'services',
  'industries',
  'platforms',
  'process-steps',
  'benefits',
  'statistics',
  'blog',
  'careers',
  'job-applications',
  'rider-applications',
  'testimonials',
  'clients',
  'portfolio',
  'faq',
  'gallery',
  'contact-requests',
  'newsletter',
  'media',
  'awards',
  'certificates',
  'offices',
  'team',
];

// Modules Editors are trusted with — everything content-related, excluding
// access-control (users/roles/permissions), site settings, and audit trails.
const EDITOR_MODULES = new Set([
  'homepage',
  'hero-banners',
  'page-content',
  'seo',
  'services',
  'industries',
  'platforms',
  'process-steps',
  'benefits',
  'statistics',
  'blog',
  'careers',
  'job-applications',
  'rider-applications',
  'testimonials',
  'clients',
  'portfolio',
  'faq',
  'gallery',
  'contact-requests',
  'newsletter',
  'media',
  'awards',
  'certificates',
  'offices',
  'team',
]);

async function seedPermissions() {
  const permissions = [];
  for (const moduleName of MODULES) {
    const key = `${moduleName}:manage`;
    const permission = await Permission.findOneAndUpdate(
      { key },
      { key, module: moduleName, action: 'manage', description: `Manage ${moduleName.replace(/-/g, ' ')}` },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    permissions.push(permission);
  }
  return permissions;
}

async function seedRoles(permissions) {
  const superAdminRole = await Role.findOneAndUpdate(
    { slug: 'super-admin' },
    {
      name: 'Super Admin',
      description: 'Full access to every module. Cannot be renamed, deleted, or deactivated.',
      isSystem: true,
      permissions: permissions.map((p) => p.id),
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );

  const editorPermissionIds = permissions.filter((p) => EDITOR_MODULES.has(p.module)).map((p) => p.id);
  await Role.findOneAndUpdate(
    { slug: 'editor' },
    {
      name: 'Editor',
      description: 'Manages public-facing content. No access to users, roles, permissions, or settings.',
      isSystem: false,
      permissions: editorPermissionIds,
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );

  return superAdminRole;
}

async function seedAdminUser(superAdminRole) {
  const email = env.SEED_ADMIN_EMAIL || 'admin@zerivon.in';
  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`[seed] Admin user already exists (${email}) — skipping.`);
    return existing;
  }

  const generatedPassword = crypto.randomBytes(9).toString('base64url');
  const password = env.SEED_ADMIN_PASSWORD || generatedPassword;

  await User.create({
    name: env.SEED_ADMIN_NAME || 'Zerivon Admin',
    email,
    password,
    role: superAdminRole.id,
    isEmailVerified: true,
  });

  console.log('[seed] Created first admin user:');
  console.log(`         email:    ${email}`);
  console.log(
    env.SEED_ADMIN_PASSWORD
      ? '         password: (from SEED_ADMIN_PASSWORD env var)'
      : `         password: ${password}  <-- save this now, it will not be shown again`
  );
}

async function run() {
  await connectDB();
  console.log('[seed] Connected. Seeding permissions, roles, and admin user...');

  const permissions = await seedPermissions();
  console.log(`[seed] Upserted ${permissions.length} permissions.`);

  const superAdminRole = await seedRoles(permissions);
  console.log('[seed] Upserted Super Admin and Editor roles.');

  await seedAdminUser(superAdminRole);

  await disconnectDB();
  console.log('[seed] Done.');
  process.exit(0);
}

run().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
