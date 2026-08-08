import { useState } from 'react';
import { History } from 'lucide-react';
import { Seo } from '../../../components/ui/Seo';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { DataTable } from '../../../components/admin/DataTable';
import { formatRelativeTime, formatActionLabel } from '../../../lib/format';
import { activityLogsApi } from '../../../api/activityLogs.api';

export default function ActivityLogs() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = activityLogsApi.useList({ page, limit: 25, sort: '-createdAt' });

  return (
    <>
      <Seo title="Activity Logs" noIndex />
      <div className="flex flex-col gap-6">
        <AdminPageHeader title="Activity Logs" description="A read-only audit trail of admin actions across the site." />

        <DataTable
          isLoading={isLoading}
          data={data?.items ?? []}
          meta={data?.meta}
          page={page}
          onPageChange={setPage}
          emptyIcon={History}
          emptyTitle="No activity recorded yet"
          columns={[
            { key: 'user', header: 'User', render: (row) => row.user?.name ?? 'System' },
            { key: 'action', header: 'Action', render: (row) => formatActionLabel(row.action, row.module) },
            { key: 'createdAt', header: 'When', render: (row) => formatRelativeTime(row.createdAt) },
          ]}
        />
      </div>
    </>
  );
}
