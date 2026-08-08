import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { formatRelativeTime, formatActionLabel } from '../../lib/format';
import { History } from 'lucide-react';

const ACTION_DOT = {
  create: 'bg-success-500',
  publish: 'bg-success-500',
  approve: 'bg-success-500',
  update: 'bg-primary-500',
  login: 'bg-primary-500',
  logout: 'bg-neutral-600',
  reject: 'bg-warning-500',
  delete: 'bg-danger-500',
};

export function ActivityFeed({ entries, isLoading }) {
  return (
    <Card className="p-5">
      <h3 className="font-heading text-h4 text-neutral-900">Recent Activity</h3>
      <div className="mt-4 flex flex-col gap-4">
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="mt-1 h-2 w-2 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="mt-2 h-3 w-1/4" />
              </div>
            </div>
          ))}

        {!isLoading && entries.length === 0 && (
          <EmptyState icon={History} title="No activity yet" description="Actions across the admin will show up here." />
        )}

        {!isLoading &&
          entries.map((entry) => (
            <div key={entry._id} className="flex items-start gap-3">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${ACTION_DOT[entry.action] ?? 'bg-neutral-600'}`} />
              <div>
                <p className="text-body-sm text-neutral-900">
                  <span className="font-medium">{entry.user.name}</span> {formatActionLabel(entry.action, entry.module)}
                </p>
                <p className="text-caption text-neutral-600">{formatRelativeTime(entry.createdAt)}</p>
              </div>
            </div>
          ))}
      </div>
    </Card>
  );
}
