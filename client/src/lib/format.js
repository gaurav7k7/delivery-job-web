const UNITS = [
  { limit: 60, divisor: 1, unit: 'second' },
  { limit: 3600, divisor: 60, unit: 'minute' },
  { limit: 86400, divisor: 3600, unit: 'hour' },
  { limit: 604800, divisor: 86400, unit: 'day' },
  { limit: 2629800, divisor: 604800, unit: 'week' },
  { limit: Infinity, divisor: 2629800, unit: 'month' },
];

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

export function formatRelativeTime(isoDate) {
  const seconds = (Date.now() - new Date(isoDate).getTime()) / 1000;
  if (seconds < 5) return 'just now';
  const { divisor, unit } = UNITS.find((u) => seconds < u.limit);
  return rtf.format(-Math.round(seconds / divisor), unit);
}

export function formatActionLabel(action, moduleName) {
  const readableModule = moduleName.replace(/-/g, ' ');
  const verbs = {
    create: 'created',
    update: 'updated',
    delete: 'deleted',
    restore: 'restored',
    publish: 'published',
    approve: 'approved',
    reject: 'rejected',
    login: 'logged in',
    logout: 'logged out',
  };
  const verb = verbs[action] ?? action;
  if (action === 'login' || action === 'logout') return verb;
  return `${verb} ${readableModule}`;
}
