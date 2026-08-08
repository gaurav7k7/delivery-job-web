import { createResourceApi } from './createResourceApi';

// List/delete only — server/src/routes/newsletter.routes.js's admin section
// has no update endpoint; subscribe/unsubscribe only happen through the
// public form.
export const newsletterAdminApi = createResourceApi('newsletter', { label: 'Subscriber' });
