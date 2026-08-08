import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react';
import { Seo } from '../../../components/ui/Seo';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { DataTable } from '../../../components/admin/DataTable';
import { Drawer } from '../../../components/ui/Drawer';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { Button } from '../../../components/ui/Button';
import { FormInput } from '../../../components/admin/form/FormInput';
import { FormTextarea } from '../../../components/admin/form/FormTextarea';
import { FormSelect } from '../../../components/admin/form/FormSelect';
import { ImageUploadField } from '../../../components/admin/form/ImageUploadField';
import { PermissionGate } from '../../../components/admin/PermissionGate';
import { portfolioApi } from '../../../api/portfolio.api';
import { clientsApi } from '../../../api/clients.api';
import { industriesApi } from '../../../api/industries.api';
import { servicesApi } from '../../../api/services.api';

const schema = z.object({
  title: z.string().trim().min(2, 'Title is required'),
  client: z.string().trim().optional(),
  industry: z.string().trim().optional(),
  service: z.string().trim().optional(),
  coverImage: z.object({ url: z.string().min(1, 'Cover image is required'), publicId: z.string().optional(), alt: z.string().optional() }),
  summary: z.string().trim().min(2, 'Summary is required'),
  challenge: z.string().trim().optional(),
  solution: z.string().trim().optional(),
  results: z.string().trim().optional(),
  projectUrl: z.string().trim().optional(),
  order: z.coerce.number().optional(),
  isFeatured: z.boolean().optional(),
});

const emptyValues = {
  title: '',
  client: '',
  industry: '',
  service: '',
  coverImage: null,
  summary: '',
  challenge: '',
  solution: '',
  results: '',
  projectUrl: '',
  order: 0,
  isFeatured: false,
};

export default function Portfolio() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = portfolioApi.useList({ page, limit: 10, search: search || undefined, sort: 'order' });
  const { data: clientsData } = clientsApi.useList({ limit: 100, sort: 'order' });
  const { data: industriesData } = industriesApi.useList({ limit: 100, sort: 'order' });
  const { data: servicesData } = servicesApi.useList({ limit: 100, sort: 'order' });
  const createMutation = portfolioApi.useCreate();
  const updateMutation = portfolioApi.useUpdate();
  const removeMutation = portfolioApi.useRemove();

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
        ? {
            ...emptyValues,
            ...row,
            client: row.client?._id ?? row.client ?? '',
            industry: row.industry?._id ?? row.industry ?? '',
            service: row.service?._id ?? row.service ?? '',
          }
        : emptyValues
    );
    setDrawerOpen(true);
  }

  function onSubmit(values) {
    const payload = {
      ...values,
      client: values.client || undefined,
      industry: values.industry || undefined,
      service: values.service || undefined,
    };
    const action = editing
      ? updateMutation.mutateAsync({ id: editing._id, payload })
      : createMutation.mutateAsync(payload);
    action.then(() => setDrawerOpen(false));
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const clients = clientsData?.items ?? [];
  const industries = industriesData?.items ?? [];
  const services = servicesData?.items ?? [];

  return (
    <>
      <Seo title="Portfolio" noIndex />
      <div className="flex flex-col gap-6">
        <AdminPageHeader
          title="Portfolio"
          description="Case studies shown on the public portfolio page."
          action={
            <PermissionGate permission="portfolio:manage">
              <Button onClick={() => openDrawer(null)}>
                <Plus size={18} aria-hidden="true" />
                Add case study
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
          emptyIcon={Briefcase}
          emptyTitle="No case studies yet"
          columns={[
            { key: 'title', header: 'Title' },
            { key: 'isFeatured', header: 'Featured', render: (row) => (row.isFeatured ? 'Yes' : '—') },
            { key: 'order', header: 'Order' },
          ]}
          renderActions={(row) => (
            <div className="flex justify-end gap-1">
              <PermissionGate permission="portfolio:manage">
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
        title={editing ? 'Edit case study' : 'Add case study'}
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
            name="coverImage"
            control={control}
            render={({ field }) => (
              <ImageUploadField
                label="Cover image"
                value={field.value}
                onChange={field.onChange}
                folder="zerivon/portfolio"
                error={errors.coverImage?.url?.message || errors.coverImage?.message}
              />
            )}
          />
          <FormInput label="Title" {...register('title')} error={errors.title?.message} />
          <div className="grid grid-cols-3 gap-4">
            <FormSelect label="Client" {...register('client')}>
              <option value="">— None —</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </FormSelect>
            <FormSelect label="Industry" {...register('industry')}>
              <option value="">— None —</option>
              {industries.map((i) => (
                <option key={i._id} value={i._id}>
                  {i.name}
                </option>
              ))}
            </FormSelect>
            <FormSelect label="Service" {...register('service')}>
              <option value="">— None —</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.title}
                </option>
              ))}
            </FormSelect>
          </div>
          <FormTextarea label="Summary" {...register('summary')} error={errors.summary?.message} />
          <FormTextarea label="Challenge" {...register('challenge')} />
          <FormTextarea label="Solution" {...register('solution')} />
          <FormTextarea label="Results" {...register('results')} />
          <FormInput label="Project URL" {...register('projectUrl')} />
          <FormInput label="Order" type="number" {...register('order')} />
        </form>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete case study?"
        description={`"${deleteTarget?.title}" will be removed.`}
        isLoading={removeMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => removeMutation.mutateAsync(deleteTarget._id).then(() => setDeleteTarget(null))}
      />
    </>
  );
}
