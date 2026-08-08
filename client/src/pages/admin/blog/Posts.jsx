import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, Newspaper } from 'lucide-react';
import { Seo } from '../../../components/ui/Seo';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { DataTable } from '../../../components/admin/DataTable';
import { Drawer } from '../../../components/ui/Drawer';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { Button } from '../../../components/ui/Button';
import { FormInput } from '../../../components/admin/form/FormInput';
import { FormTextarea } from '../../../components/admin/form/FormTextarea';
import { FormSelect } from '../../../components/admin/form/FormSelect';
import { FormArrayInput } from '../../../components/admin/form/FormArrayInput';
import { FormSwitch } from '../../../components/admin/form/FormSwitch';
import { ImageUploadField } from '../../../components/admin/form/ImageUploadField';
import { PermissionGate } from '../../../components/admin/PermissionGate';
import { blogApi } from '../../../api/blog.api';

const STATUS_STYLES = {
  draft: 'bg-neutral-100 text-neutral-600',
  published: 'bg-success-500/10 text-success-500',
  archived: 'bg-warning-500/10 text-warning-500',
};

const schema = z.object({
  title: z.string().trim().min(2, 'Title is required'),
  excerpt: z.string().trim().min(2, 'Excerpt is required').max(300),
  content: z.string().trim().min(1, 'Content is required'),
  coverImage: z.object({ url: z.string().min(1, 'Cover image is required'), publicId: z.string().optional(), alt: z.string().optional() }),
  category: z.string().trim().min(1, 'Category is required'),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published', 'archived']),
  readTimeMinutes: z.coerce.number().optional(),
  isFeatured: z.boolean().optional(),
});

const emptyValues = {
  title: '',
  excerpt: '',
  content: '',
  coverImage: null,
  category: '',
  tags: [],
  status: 'draft',
  readTimeMinutes: 5,
  isFeatured: false,
};

export default function Posts() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = blogApi.useList({ page, limit: 10, search: search || undefined, sort: '-createdAt' });
  const createMutation = blogApi.useCreate();
  const updateMutation = blogApi.useUpdate();
  const removeMutation = blogApi.useRemove();

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
      <Seo title="Blog Posts" noIndex />
      <div className="flex flex-col gap-6">
        <AdminPageHeader
          title="Blog Posts"
          description="Articles shown on the public blog and the homepage's latest-posts section."
          action={
            <PermissionGate permission="blog:manage">
              <Button onClick={() => openDrawer(null)}>
                <Plus size={18} aria-hidden="true" />
                Add post
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
          emptyIcon={Newspaper}
          emptyTitle="No blog posts yet"
          columns={[
            { key: 'title', header: 'Title' },
            { key: 'category', header: 'Category' },
            {
              key: 'status',
              header: 'Status',
              render: (row) => (
                <span className={`rounded-full px-2.5 py-0.5 text-caption font-medium capitalize ${STATUS_STYLES[row.status]}`}>
                  {row.status}
                </span>
              ),
            },
            { key: 'views', header: 'Views' },
          ]}
          renderActions={(row) => (
            <div className="flex justify-end gap-1">
              <PermissionGate permission="blog:manage">
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
        title={editing ? 'Edit post' : 'Add post'}
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
                folder="zerivon/blog"
                error={errors.coverImage?.url?.message || errors.coverImage?.message}
              />
            )}
          />
          <FormInput label="Title" {...register('title')} error={errors.title?.message} />
          <FormTextarea label="Excerpt" rows={2} {...register('excerpt')} error={errors.excerpt?.message} />
          <FormTextarea label="Content" rows={8} {...register('content')} error={errors.content?.message} />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Category" {...register('category')} error={errors.category?.message} />
            <FormInput label="Read time (minutes)" type="number" {...register('readTimeMinutes')} />
          </div>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => <FormArrayInput label="Tags" value={field.value} onChange={field.onChange} placeholder="Add a tag and press Enter" />}
          />
          <FormSelect label="Status" {...register('status')}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </FormSelect>
          <Controller
            name="isFeatured"
            control={control}
            render={({ field }) => <FormSwitch label="Featured" checked={field.value} onChange={field.onChange} />}
          />
        </form>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete blog post?"
        description={`"${deleteTarget?.title}" will be removed.`}
        isLoading={removeMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => removeMutation.mutateAsync(deleteTarget._id).then(() => setDeleteTarget(null))}
      />
    </>
  );
}
