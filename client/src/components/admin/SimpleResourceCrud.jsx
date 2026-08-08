import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Seo } from '../ui/Seo';
import { AdminPageHeader } from './AdminPageHeader';
import { DataTable } from './DataTable';
import { Drawer } from '../ui/Drawer';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Button } from '../ui/Button';
import { PermissionGate } from './PermissionGate';

/**
 * Every simple content module (no relations, no bespoke workflow — see
 * Statistics/Benefits/ProcessSteps/FAQ/Clients) shares the exact same
 * table+drawer-form CRUD shell. Modules with relations or extra workflow
 * (Services, Testimonials, ...) write their own page instead of forcing it
 * through here.
 */
export function SimpleResourceCrud({
  api,
  permission,
  seoTitle,
  title,
  description,
  itemLabel,
  itemNameField = 'title',
  emptyIcon,
  columns,
  schema,
  defaultValues,
  listParams = { limit: 10, sort: 'order' },
  renderFields,
}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = api.useList({ page, search: search || undefined, ...listParams });
  const createMutation = api.useCreate();
  const updateMutation = api.useUpdate();
  const removeMutation = api.useRemove();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues });

  function openDrawer(row) {
    setEditing(row ?? null);
    reset(row ? { ...defaultValues, ...row } : defaultValues);
    setDrawerOpen(true);
  }

  function onSubmit(values) {
    const action = editing
      ? updateMutation.mutateAsync({ id: editing._id, payload: values })
      : createMutation.mutateAsync(values);
    action.then(() => setDrawerOpen(false));
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const lowerLabel = itemLabel.toLowerCase();

  return (
    <>
      <Seo title={seoTitle} noIndex />
      <div className="flex flex-col gap-6">
        <AdminPageHeader
          title={title}
          description={description}
          action={
            <PermissionGate permission={permission}>
              <Button onClick={() => openDrawer(null)}>
                <Plus size={18} aria-hidden="true" />
                Add {lowerLabel}
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
          emptyIcon={emptyIcon}
          emptyTitle={`No ${lowerLabel}s yet`}
          columns={columns}
          renderActions={(row) => (
            <div className="flex justify-end gap-1">
              <PermissionGate permission={permission}>
                <button
                  type="button"
                  onClick={() => openDrawer(row)}
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
        title={editing ? `Edit ${lowerLabel}` : `Add ${lowerLabel}`}
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
          {renderFields({ register, control, errors })}
        </form>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete ${lowerLabel}?`}
        description={deleteTarget ? `"${deleteTarget[itemNameField]}" will be removed.` : ''}
        isLoading={removeMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => removeMutation.mutateAsync(deleteTarget._id).then(() => setDeleteTarget(null))}
      />
    </>
  );
}
