import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, CheckCircle2, Circle, Quote } from 'lucide-react';
import { Seo } from '../../../components/ui/Seo';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { DataTable } from '../../../components/admin/DataTable';
import { Drawer } from '../../../components/ui/Drawer';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { Button } from '../../../components/ui/Button';
import { FormInput } from '../../../components/admin/form/FormInput';
import { FormTextarea } from '../../../components/admin/form/FormTextarea';
import { FormSelect } from '../../../components/admin/form/FormSelect';
import { FormSwitch } from '../../../components/admin/form/FormSwitch';
import { ImageUploadField } from '../../../components/admin/form/ImageUploadField';
import { PermissionGate } from '../../../components/admin/PermissionGate';
import { testimonialsApi } from '../../../api/testimonials.api';
import { platformsApi } from '../../../api/platforms.api';

const schema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  designation: z.string().trim().optional(),
  city: z.string().trim().optional(),
  platform: z.string().trim().optional(),
  message: z.string().trim().min(2, 'Message is required').max(1000),
  rating: z.coerce.number().min(1).max(5),
  avatar: z.object({ url: z.string(), publicId: z.string().optional(), alt: z.string().optional() }).nullable().optional(),
  isApproved: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  order: z.coerce.number().optional(),
});

const emptyValues = {
  name: '',
  designation: '',
  city: '',
  platform: '',
  message: '',
  rating: 5,
  avatar: null,
  isApproved: false,
  isFeatured: false,
  order: 0,
};

export default function Testimonials() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = testimonialsApi.useList({ page, limit: 10, search: search || undefined, sort: '-createdAt' });
  const { data: platformsData } = platformsApi.useList({ limit: 50, sort: 'order' });
  const createMutation = testimonialsApi.useCreate();
  const updateMutation = testimonialsApi.useUpdate();
  const removeMutation = testimonialsApi.useRemove();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: emptyValues });

  function openDrawer(row) {
    setEditing(row ?? null);
    reset(row ? { ...emptyValues, ...row, platform: row.platform?._id ?? row.platform ?? '' } : emptyValues);
    setDrawerOpen(true);
  }

  function onSubmit(values) {
    const payload = { ...values, platform: values.platform || undefined };
    const action = editing
      ? updateMutation.mutateAsync({ id: editing._id, payload })
      : createMutation.mutateAsync(payload);
    action.then(() => setDrawerOpen(false));
  }

  function toggleApproval(row) {
    updateMutation.mutate({ id: row._id, payload: { isApproved: !row.isApproved } });
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const platforms = platformsData?.items ?? [];

  return (
    <>
      <Seo title="Testimonials" noIndex />
      <div className="flex flex-col gap-6">
        <AdminPageHeader
          title="Testimonials"
          description="Rider testimonials — new submissions need approval before they appear on the site."
          action={
            <PermissionGate permission="testimonials:manage">
              <Button onClick={() => openDrawer(null)}>
                <Plus size={18} aria-hidden="true" />
                Add testimonial
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
          emptyIcon={Quote}
          emptyTitle="No testimonials yet"
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'message', header: 'Message', render: (row) => <span className="line-clamp-1 max-w-xs">{row.message}</span> },
            { key: 'rating', header: 'Rating', render: (row) => '★'.repeat(row.rating) },
            {
              key: 'isApproved',
              header: 'Approved',
              render: (row) => (
                <button
                  type="button"
                  onClick={() => toggleApproval(row)}
                  className={row.isApproved ? 'flex items-center gap-1 text-success-500' : 'flex items-center gap-1 text-neutral-600'}
                >
                  {row.isApproved ? <CheckCircle2 size={16} aria-hidden="true" /> : <Circle size={16} aria-hidden="true" />}
                  {row.isApproved ? 'Approved' : 'Pending'}
                </button>
              ),
            },
          ]}
          renderActions={(row) => (
            <div className="flex justify-end gap-1">
              <PermissionGate permission="testimonials:manage">
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
        title={editing ? 'Edit testimonial' : 'Add testimonial'}
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
            name="avatar"
            control={control}
            render={({ field }) => (
              <ImageUploadField label="Avatar" value={field.value} onChange={field.onChange} folder="zerivon/testimonials" />
            )}
          />
          <FormInput label="Name" {...register('name')} error={errors.name?.message} />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Designation" {...register('designation')} />
            <FormInput label="City" {...register('city')} />
          </div>
          <FormSelect label="Platform" {...register('platform')}>
            <option value="">— None —</option>
            {platforms.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </FormSelect>
          <FormTextarea label="Message" {...register('message')} error={errors.message?.message} />
          <FormInput label="Rating (1-5)" type="number" min={1} max={5} {...register('rating')} error={errors.rating?.message} />
          <Controller name="isApproved" control={control} render={({ field }) => <FormSwitch label="Approved" checked={field.value} onChange={field.onChange} />} />
          <Controller name="isFeatured" control={control} render={({ field }) => <FormSwitch label="Featured on homepage" checked={field.value} onChange={field.onChange} />} />
          <FormInput label="Order" type="number" {...register('order')} />
        </form>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete testimonial?"
        description={`The testimonial from "${deleteTarget?.name}" will be removed.`}
        isLoading={removeMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => removeMutation.mutateAsync(deleteTarget._id).then(() => setDeleteTarget(null))}
      />
    </>
  );
}
