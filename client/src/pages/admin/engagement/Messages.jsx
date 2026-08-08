import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil, Trash2, Mail } from 'lucide-react';
import { Seo } from '../../../components/ui/Seo';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { DataTable } from '../../../components/admin/DataTable';
import { Drawer } from '../../../components/ui/Drawer';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { Button } from '../../../components/ui/Button';
import { FormSelect } from '../../../components/admin/form/FormSelect';
import { PermissionGate } from '../../../components/admin/PermissionGate';
import { contactRequestsApi } from '../../../api/contactRequests.api';

const STATUSES = ['unread', 'read', 'replied', 'archived'];

const STATUS_STYLES = {
  unread: 'bg-primary-500/10 text-primary-700',
  read: 'bg-neutral-100 text-neutral-600',
  replied: 'bg-success-500/10 text-success-500',
  archived: 'bg-warning-500/10 text-warning-500',
};

const schema = z.object({ status: z.enum(STATUSES) });

export default function Messages() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = contactRequestsApi.useList({ page, limit: 10, search: search || undefined, sort: '-createdAt' });
  const updateMutation = contactRequestsApi.useUpdate();
  const removeMutation = contactRequestsApi.useRemove();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm({ resolver: zodResolver(schema) });

  function openDrawer(row) {
    setEditing(row);
    reset({ status: row.status });
    setDrawerOpen(true);
  }

  function onSubmit(values) {
    updateMutation.mutateAsync({ id: editing._id, payload: values }).then(() => setDrawerOpen(false));
  }

  return (
    <>
      <Seo title="Messages" noIndex />
      <div className="flex flex-col gap-6">
        <AdminPageHeader title="Messages" description="Submissions from the public contact form." />

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
          emptyTitle="No messages yet"
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'email', header: 'Email' },
            { key: 'message', header: 'Message', render: (row) => <span className="line-clamp-1 max-w-xs">{row.message}</span> },
            {
              key: 'status',
              header: 'Status',
              render: (row) => (
                <span className={`rounded-full px-2.5 py-0.5 text-caption font-medium capitalize ${STATUS_STYLES[row.status]}`}>
                  {row.status}
                </span>
              ),
            },
          ]}
          renderActions={(row) => (
            <div className="flex justify-end gap-1">
              <PermissionGate permission="contact-requests:manage">
                <button type="button" onClick={() => openDrawer(row)} aria-label="Edit" className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100">
                  <Pencil size={15} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => setDeleteTarget(row)} aria-label="Delete" className="flex h-8 w-8 items-center justify-center rounded-md text-danger-700 hover:bg-danger-500/10">
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </PermissionGate>
            </div>
          )}
        />
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? `Message from ${editing.name}` : ''}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmit(onSubmit)} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving…' : 'Save'}
            </Button>
          </div>
        }
      >
        {editing && (
          <div className="flex flex-col gap-4">
            <div className="rounded-md border border-neutral-200 p-4">
              <p className="text-body-sm font-medium text-neutral-900">{editing.subject || 'No subject'}</p>
              <p className="mt-2 whitespace-pre-wrap text-body-sm text-neutral-600">{editing.message}</p>
              <p className="mt-3 text-caption text-neutral-600">
                {editing.email}
                {editing.phone ? ` · ${editing.phone}` : ''}
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <FormSelect label="Status" {...register('status')}>
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s}
                  </option>
                ))}
              </FormSelect>
            </form>
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete message?"
        description={`The message from "${deleteTarget?.name}" will be removed.`}
        isLoading={removeMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => removeMutation.mutateAsync(deleteTarget._id).then(() => setDeleteTarget(null))}
      />
    </>
  );
}
