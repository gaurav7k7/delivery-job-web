import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Plus, Pencil, Trash2, KeyRound } from 'lucide-react';
import { Seo } from '../../../components/ui/Seo';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { DataTable } from '../../../components/admin/DataTable';
import { Drawer } from '../../../components/ui/Drawer';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { Button } from '../../../components/ui/Button';
import { FormInput } from '../../../components/admin/form/FormInput';
import { FormSelect } from '../../../components/admin/form/FormSelect';
import { PermissionGate } from '../../../components/admin/PermissionGate';
import { permissionsApi } from '../../../api/permissions.api';

const ACTIONS = ['create', 'read', 'update', 'delete', 'publish', 'manage'];

const createSchema = z.object({
  key: z.string().trim().min(3, 'Key is required'),
  module: z.string().trim().min(2, 'Module is required'),
  action: z.enum(ACTIONS),
  description: z.string().trim().optional(),
});

const updateSchema = z.object({ description: z.string().trim().optional() });

const emptyValues = { key: '', module: '', action: 'manage', description: '' };

export default function Permissions() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = permissionsApi.useList({ page, limit: 15, search: search || undefined, sort: 'module' });
  const createMutation = permissionsApi.useCreate();
  const updateMutation = permissionsApi.useUpdate();
  const removeMutation = permissionsApi.useRemove();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({ defaultValues: emptyValues });

  function openDrawer(row) {
    setEditing(row ?? null);
    reset(row ? { ...emptyValues, ...row } : emptyValues);
    setDrawerOpen(true);
  }

  function onSubmit(values) {
    const schema = editing ? updateSchema : createSchema;
    const result = schema.safeParse(values);
    if (!result.success) {
      for (const issue of result.error.issues) setError(issue.path[0], { message: issue.message });
      return;
    }
    const action = editing
      ? updateMutation.mutateAsync({ id: editing._id, payload: result.data })
      : createMutation.mutateAsync(result.data);
    action.then(() => setDrawerOpen(false));
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <Seo title="Permissions" noIndex />
      <div className="flex flex-col gap-6">
        <AdminPageHeader
          title="Permissions"
          description="The individual permission keys roles are built from. Seeded automatically — rarely need manual changes."
          action={
            <PermissionGate permission="permissions:manage">
              <Button onClick={() => openDrawer(null)}>
                <Plus size={18} aria-hidden="true" />
                Add permission
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
          emptyIcon={KeyRound}
          emptyTitle="No permissions yet"
          columns={[
            { key: 'key', header: 'Key' },
            { key: 'module', header: 'Module' },
            { key: 'action', header: 'Action' },
          ]}
          renderActions={(row) => (
            <div className="flex justify-end gap-1">
              <PermissionGate permission="permissions:manage">
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
        title={editing ? 'Edit permission' : 'Add permission'}
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
          <FormInput
            label="Key"
            placeholder="module:action"
            {...register('key')}
            error={errors.key?.message}
            disabled={Boolean(editing)}
            hint={editing ? 'Key cannot be changed after creation' : undefined}
          />
          <FormInput label="Module" {...register('module')} error={errors.module?.message} disabled={Boolean(editing)} />
          <FormSelect label="Action" {...register('action')} disabled={Boolean(editing)}>
            {ACTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </FormSelect>
          <FormInput label="Description" {...register('description')} />
        </form>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete permission?"
        description={`"${deleteTarget?.key}" will be removed. Any role referencing it loses that access.`}
        isLoading={removeMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => removeMutation.mutateAsync(deleteTarget._id).then(() => setDeleteTarget(null))}
      />
    </>
  );
}
