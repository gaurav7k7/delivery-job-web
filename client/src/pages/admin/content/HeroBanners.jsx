import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
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
import { heroBannersApi } from '../../../api/heroBanners.api';

const ctaSchema = z.object({ label: z.string().trim().optional(), url: z.string().trim().optional() }).optional();

const schema = z.object({
  page: z.string().trim().min(1, 'Page is required'),
  title: z.string().trim().min(1, 'Title is required'),
  subtitle: z.string().trim().optional(),
  description: z.string().trim().optional(),
  image: z.object({ url: z.string().min(1, 'Image is required'), publicId: z.string().optional(), alt: z.string().optional() }),
  order: z.coerce.number().optional(),
  ctaPrimary: ctaSchema,
  ctaSecondary: ctaSchema,
});

const emptyValues = {
  page: '',
  title: '',
  subtitle: '',
  description: '',
  image: null,
  order: 0,
  ctaPrimary: { label: '', url: '' },
  ctaSecondary: { label: '', url: '' },
};

export default function HeroBanners() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = heroBannersApi.useList({ page, limit: 10, search: search || undefined, sort: 'order' });
  const createMutation = heroBannersApi.useCreate();
  const updateMutation = heroBannersApi.useUpdate();
  const removeMutation = heroBannersApi.useRemove();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: emptyValues });

  useEffect(() => {
    if (drawerOpen) reset(editing ? { ...emptyValues, ...editing } : emptyValues);
  }, [drawerOpen, editing, reset]);

  function openCreate() {
    setEditing(null);
    setDrawerOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
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
      <Seo title="Hero Banners" noIndex />
      <div className="flex flex-col gap-6">
        <AdminPageHeader
          title="Hero Banners"
          description="Manage the hero images and headline copy shown at the top of each page."
          action={
            <PermissionGate permission="hero-banners:manage">
              <Button onClick={openCreate}>
                <Plus size={18} aria-hidden="true" />
                Add banner
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
          emptyIcon={ImageIcon}
          emptyTitle="No hero banners yet"
          emptyDescription="Add a banner to control what visitors see at the top of a page."
          columns={[
            {
              key: 'image',
              header: '',
              render: (row) => (
                <div className="h-10 w-16 overflow-hidden rounded bg-neutral-100">
                  {row.image?.url && <img src={row.image.url} alt="" className="h-full w-full object-cover" />}
                </div>
              ),
            },
            { key: 'title', header: 'Title' },
            { key: 'page', header: 'Page' },
            { key: 'order', header: 'Order' },
            { key: 'isActive', header: 'Status', render: (row) => (row.isActive ? 'Active' : 'Inactive') },
          ]}
          renderActions={(row) => (
            <div className="flex justify-end gap-1">
              <PermissionGate permission="hero-banners:manage">
                <button
                  type="button"
                  onClick={() => openEdit(row)}
                  aria-label="Edit"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100"
                >
                  <Pencil size={15} aria-hidden="true" />
                </button>
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

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit hero banner' : 'Add hero banner'}
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
              <ImageUploadField label="Banner image" value={field.value} onChange={field.onChange} error={errors.image?.url?.message || errors.image?.message} folder="zerivon/hero-banners" />
            )}
          />
          <FormInput label="Page" list="hero-banner-pages" placeholder="home" {...register('page')} error={errors.page?.message} />
          <datalist id="hero-banner-pages">
            <option value="home" />
            <option value="about" />
            <option value="services" />
            <option value="careers" />
            <option value="contact" />
          </datalist>
          <FormInput label="Title" {...register('title')} error={errors.title?.message} />
          <FormInput label="Subtitle" {...register('subtitle')} error={errors.subtitle?.message} />
          <FormTextarea label="Description" {...register('description')} error={errors.description?.message} />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Primary CTA label" {...register('ctaPrimary.label')} />
            <FormInput label="Primary CTA URL" {...register('ctaPrimary.url')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Secondary CTA label" {...register('ctaSecondary.label')} />
            <FormInput label="Secondary CTA URL" {...register('ctaSecondary.url')} />
          </div>
          <FormInput label="Order" type="number" {...register('order')} error={errors.order?.message} />
        </form>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete hero banner?"
        description={`"${deleteTarget?.title}" will be removed from the page it appears on.`}
        isLoading={removeMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => removeMutation.mutateAsync(deleteTarget._id).then(() => setDeleteTarget(null))}
      />
    </>
  );
}
