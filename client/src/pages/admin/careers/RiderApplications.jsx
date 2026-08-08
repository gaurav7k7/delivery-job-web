import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { Seo } from '../../../components/ui/Seo';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { DataTable } from '../../../components/admin/DataTable';
import { Drawer } from '../../../components/ui/Drawer';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { Button } from '../../../components/ui/Button';
import { FormSelect } from '../../../components/admin/form/FormSelect';
import { FormTextarea } from '../../../components/admin/form/FormTextarea';
import { PermissionGate } from '../../../components/admin/PermissionGate';
import { riderApplicationsApi } from '../../../api/riderApplications.api';

const STATUSES = ['new', 'contacted', 'onboarded', 'rejected'];

const schema = z.object({
  status: z.enum(STATUSES),
  notes: z.string().trim().optional(),
});

export default function RiderApplications() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = riderApplicationsApi.useList({ page, limit: 10, search: search || undefined, sort: '-createdAt' });
  const updateMutation = riderApplicationsApi.useUpdate();
  const removeMutation = riderApplicationsApi.useRemove();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  function openDrawer(row) {
    setEditing(row);
    reset({ status: row.status, notes: row.notes ?? '' });
    setDrawerOpen(true);
  }

  function onSubmit(values) {
    updateMutation.mutateAsync({ id: editing._id, payload: values }).then(() => setDrawerOpen(false));
  }

  return (
    <>
      <Seo title="Rider Applications" noIndex />
      <div className="flex flex-col gap-6">
        <AdminPageHeader title="Rider Applications" description="Leads from the “Become a Rider” form — the core conversion funnel." />

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
          emptyIcon={UserPlus}
          emptyTitle="No rider applications yet"
          columns={[
            { key: 'fullName', header: 'Name' },
            { key: 'phone', header: 'Phone' },
            { key: 'city', header: 'City' },
            { key: 'vehicleType', header: 'Vehicle', render: (row) => row.vehicleType ?? '—' },
            { key: 'status', header: 'Status', render: (row) => <span className="capitalize">{row.status}</span> },
          ]}
          renderActions={(row) => (
            <div className="flex justify-end gap-1">
              <PermissionGate permission="rider-applications:manage">
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
        title={editing ? `Update: ${editing.fullName}` : ''}
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <FormSelect label="Status" {...register('status')} error={errors.status?.message}>
            {STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </FormSelect>
          <FormTextarea label="Internal notes" {...register('notes')} />
        </form>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete application?"
        description={`The application from "${deleteTarget?.fullName}" will be removed.`}
        isLoading={removeMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => removeMutation.mutateAsync(deleteTarget._id).then(() => setDeleteTarget(null))}
      />
    </>
  );
}
