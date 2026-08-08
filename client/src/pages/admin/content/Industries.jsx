import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, Factory } from 'lucide-react';
import { Seo } from '../../../components/ui/Seo';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { DataTable } from '../../../components/admin/DataTable';
import { Drawer } from '../../../components/ui/Drawer';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { Button } from '../../../components/ui/Button';
import { FormInput } from '../../../components/admin/form/FormInput';
import { FormTextarea } from '../../../components/admin/form/FormTextarea';
import { ImageUploadField } from '../../../components/admin/form/ImageUploadField';
import { PermissionGate } from '../../../components/admin/PermissionGate';
import { industriesApi } from '../../../api/industries.api';

const schema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  icon: z.string().trim().optional(),
  description: z.string().trim().optional(),
  image: z.object({ url: z.string(), publicId: z.string().optional(), alt: z.string().optional() }).nullable().optional(),
  order: z.coerce.number().optional(),
});

const emptyValues = { name: '', icon: '', description: '', image: null, order: 0 };

export default function Industries() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = industriesApi.useList({ page, limit: 10, search: search || undefined, sort: 'order' });
  const createMutation = industriesApi.useCreate();
  const updateMutation = industriesApi.useUpdate();
  const removeMutation = industriesApi.useRemove();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: emptyValues });

  function openDrawer(row) {
    setEditing(row ?? null);
    reset(row ? { ...emptyValues, ...row } : emptyValues);
    setDrawerOpen(true);
  }

  function onSubmit(values) {
    const action = editing
      ? updateMutation.mutateAsync({ id: editing._id, payload: values })
      : createMutation.mutateAsync(values);
    action.then(() => setDrawerOpen(false));
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <Seo title="Industries" noIndex />
      <div className="flex flex-col gap-6">
        <AdminPageHeader
          title="Industries"
          description="The industries Zerivon serves, shown on the homepage and services pages."
          action={
            <PermissionGate permission="industries:manage">
              <Button onClick={() => openDrawer(null)}>
                <Plus size={18} aria-hidden="true" />
                Add industry
              </Button>
            </PermissionGate>
          }
        />

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
          emptyIcon={Factory}
          emptyTitle="No industries yet"
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'order', header: 'Order' },
            { key: 'isActive', header: 'Status', render: (row) => (row.isActive ? 'Active' : 'Inactive') },
          ]}
          renderActions={(row) => (
            <div className="flex justify-end gap-1">
              <PermissionGate permission="industries:manage">
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
        title={editing ? 'Edit industry' : 'Add industry'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmit(onSubmit)} disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <ImageUploadField label="Image" value={field.value} onChange={field.onChange} folder="zerivon/industries" />
            )}
          />
          <FormInput label="Name" {...register('name')} error={errors.name?.message} />
          <FormInput label="Icon" hint="e.g. rocket, users, truck, shield, star, award, clock (curated set)" {...register('icon')} error={errors.icon?.message} />
          <FormTextarea label="Description" {...register('description')} error={errors.description?.message} />
          <FormInput label="Order" type="number" {...register('order')} error={errors.order?.message} />
        </form>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete industry?"
        description={`"${deleteTarget?.name}" will be removed.`}
        isLoading={removeMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => removeMutation.mutateAsync(deleteTarget._id).then(() => setDeleteTarget(null))}
      />
    </>
  );
}
