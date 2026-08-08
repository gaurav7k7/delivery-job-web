import { useState } from 'react';
import { Trash2, Mail } from 'lucide-react';
import { Seo } from '../../../components/ui/Seo';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { DataTable } from '../../../components/admin/DataTable';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { PermissionGate } from '../../../components/admin/PermissionGate';
import { newsletterAdminApi } from '../../../api/newsletter.admin.api';

export default function Newsletter() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = newsletterAdminApi.useList({ page, limit: 20, search: search || undefined, sort: '-createdAt' });
  const removeMutation = newsletterAdminApi.useRemove();

  return (
    <>
      <Seo title="Newsletter" noIndex />
      <div className="flex flex-col gap-6">
        <AdminPageHeader title="Newsletter Subscribers" description="Everyone who has subscribed via the public site." />

        <DataTable
          isLoading={isLoading}
          data={data?.items ?? []}
          meta={data?.meta}
          page={page}
          onPageChange={setPage}
          search={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          emptyIcon={Mail}
          emptyTitle="No subscribers yet"
          columns={[
            { key: 'email', header: 'Email' },
            { key: 'isSubscribed', header: 'Status', render: (row) => (row.isSubscribed ? 'Subscribed' : 'Unsubscribed') },
            { key: 'subscribedAt', header: 'Subscribed on', render: (row) => new Date(row.subscribedAt).toLocaleDateString() },
          ]}
          renderActions={(row) => (
            <div className="flex justify-end gap-1">
              <PermissionGate permission="newsletter:manage">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(row)}
                  aria-label="Delete"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-danger-700 hover:bg-danger-500/10"
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </PermissionGate>
            </div>
          )}
        />
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete subscriber?"
        description={`"${deleteTarget?.email}" will be removed from the list.`}
        isLoading={removeMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => removeMutation.mutateAsync(deleteTarget._id).then(() => setDeleteTarget(null))}
      />
    </>
  );
}
