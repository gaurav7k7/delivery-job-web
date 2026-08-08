import { Router } from 'express';
import { env } from '../config/env.js';

const router = Router();

router.get('/', (req, res) => {
  const lines = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api',
    '',
    `Sitemap: ${env.SITE_URL}/sitemap.xml`,
  ];
  res.type('text/plain').send(lines.join('\n'));
});

export default router;
