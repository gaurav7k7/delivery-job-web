import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, Wrench } from 'lucide-react';
import { Seo } from '../../../components/ui/Seo';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { DataTable } from '../../../components/admin/DataTable';
import { Drawer } from '../../../components/ui/Drawer';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { Button } from '../../../components/ui/Button';
import { FormInput } from '../../../components/admin/form/FormInput';
import { FormTextarea } from '../../../components/admin/form/FormTextarea';
import { FormArrayInput } from '../../../components/admin/form/FormArrayInput';
import { FormSwitch } from '../../../components/admin/form/FormSwitch';
import { ImageUploadField } from '../../../components/admin/form/ImageUploadField';
import { PermissionGate } from '../../../components/admin/PermissionGate';
import { servicesApi } from '../../../api/services.api';
import { industriesApi } from '../../../api/industries.api';

const schema = z.object({
  title: z.string().trim().min(2, 'Title is required'),
  icon: z.string().trim().optional(),
  shortDescription: z.string().trim().min(2, 'Short description is required').max(200),
  description: z.string().trim().optional(),
  features: z.array(z.string()).optional(),
  image: z.object({ url: z.string(), publicId: z.string().optional(), alt: z.string().optional() }).nullable().optional(),
  industries: z.array(z.string()).optional(),
  order: z.coerce.number().optional(),
  isFeatured: z.boolean().optional(),
});

const emptyValues = {
  title: '',
  icon: '',
  shortDescription: '',
  description: '',
  features: [],
  image: null,
  industries: [],
  order: 0,
  isFeatured: false,
};

export default function Services() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = servicesApi.useList({ page, limit: 10, search: search || undefined, sort: 'order' });
  const { data: industriesData } = industriesApi.useList({ limit: 100, sort: 'order' });
  const createMutation = servicesApi.useCreate();
  const updateMutation = servicesApi.useUpdate();
  const removeMutation = servicesApi.useRemove();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: emptyValues });

  function openDrawer(row) {
    setEditing(row ?? null);
    reset(
      row
        ? { ...emptyValues, ...row, industries: (row.industries ?? []).map((i) => (typeof i === 'string' ? i : i._id)) }
        : emptyValues
    );
    setDrawerOpen(true);
  }

  function onSubmit(values) {
    const action = editing
      ? updateMutation.mutateAsync({ id: editing._id, payload: values })
      : createMutation.mutateAsync(values);
    action.then(() => setDrawerOpen(false));
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const industries = industriesData?.items ?? [];

  return (
    <>
      <Seo title="Services" noIndex />
      <div className="flex flex-col gap-6">
        <AdminPageHeader
          title="Services"
          description="The services Zerivon offers — shown on the homepage and the services page."
          action={
            <PermissionGate permission="services:manage">
              <Button onClick={() => openDrawer(null)}>
                <Plus size={18} aria-hidden="true" />
                Add service
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
          emptyIcon={Wrench}
          emptyTitle="No services yet"
          columns={[
            { key: 'title', header: 'Title' },
            { key: 'isFeatured', header: 'Featured', render: (row) => (row.isFeatured ? 'Yes' : '—') },
            { key: 'order', header: 'Order' },
            { key: 'isActive', header: 'Status', render: (row) => (row.isActive ? 'Active' : 'Inactive') },
          ]}
          renderActions={(row) => (
            <div className="flex justify-end gap-1">
              <PermissionGate permission="services:manage">
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
        title={editing ? 'Edit service' : 'Add service'}
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
              <ImageUploadField label="Image" value={field.value} onChange={field.onChange} folder="zerivon/services" />
            )}
          />
          <FormInput label="Title" {...register('title')} error={errors.title?.message} />
          <FormInput label="Icon" hint="e.g. rocket, users, truck, shield, star, award, clock (curated set)" {...register('icon')} error={errors.icon?.message} />
          <FormTextarea label="Short description" rows={2} {...register('shortDescription')} error={errors.shortDescription?.message} />
          <FormTextarea label="Full description" {...register('description')} error={errors.description?.message} />
          <Controller
            name="features"
            control={control}
            render={({ field }) => (
              <FormArrayInput label="Key features" value={field.value} onChange={field.onChange} placeholder="Add a feature and press Enter" />
            )}
          />

          {industries.length > 0 && (
            <div>
              <p className="mb-1.5 text-body-sm font-medium text-neutral-900">Related industries</p>
              <Controller
                name="industries"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2 rounded-md border border-neutral-200 p-3">
                    {industries.map((industry) => {
                      const checked = field.value?.includes(industry._id);
                      return (
                        <label
                          key={industry._id}
                          className="flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1 text-caption text-neutral-900 has-checked:border-primary-500 has-checked:bg-primary-500/10"
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={checked}
                            onChange={() =>
                              field.onChange(
                                checked
                                  ? field.value.filter((id) => id !== industry._id)
                                  : [...(field.value ?? []), industry._id]
                              )
                            }
                          />
                          {industry.name}
                        </label>
                      );
                    })}
                  </div>
                )}
              />
            </div>
          )}

          <Controller
            name="isFeatured"
            control={control}
            render={({ field }) => (
              <FormSwitch label="Featured on homepage" checked={field.value} onChange={field.onChange} />
            )}
          />
          <FormInput label="Order" type="number" {...register('order')} error={errors.order?.message} />
        </form>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete service?"
        description={`"${deleteTarget?.title}" will be removed.`}
        isLoading={removeMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => removeMutation.mutateAsync(deleteTarget._id).then(() => setDeleteTarget(null))}
      />
    </>
  );
}
