import { Card } from '../ui/Card';
import { cn } from '../../lib/cn';

export function StatCard({ icon: Icon, label, value, trend, tone = 'primary' }) {
  const toneClasses = {
    primary: 'bg-primary-50 text-primary-500',
    accent: 'bg-accent-500/10 text-accent-700',
    success: 'bg-success-500/10 text-success-700',
    warning: 'bg-warning-500/10 text-warning-700',
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-body-sm text-neutral-600">{label}</p>
          <p className="mt-1 font-heading text-h2 text-neutral-900">{value}</p>
          {trend && (
            <p className={cn('mt-1 text-caption font-medium', trend.direction === 'up' ? 'text-success-700' : 'text-danger-700')}>
              {trend.direction === 'up' ? '↑' : '↓'} {trend.label}
            </p>
          )}
        </div>
        <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-md', toneClasses[tone])}>
          <Icon size={20} aria-hidden="true" />
        </div>
      </div>
    </Card>
  );
}
