import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, ShieldCheck, Lock } from 'lucide-react';
import { Seo } from '../../../components/ui/Seo';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { DataTable } from '../../../components/admin/DataTable';
import { Drawer } from '../../../components/ui/Drawer';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { Button } from '../../../components/ui/Button';
import { FormInput } from '../../../components/admin/form/FormInput';
import { FormTextarea } from '../../../components/admin/form/FormTextarea';
import { PermissionGate } from '../../../components/admin/PermissionGate';
import { rolesApi } from '../../../api/roles.api';
import { permissionsApi } from '../../../api/permissions.api';

const schema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  description: z.string().trim().optional(),
  permissions: z.array(z.string()).optional(),
});

const emptyValues = { name: '', description: '', permissions: [] };

export default function Roles() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = rolesApi.useList({ page, limit: 10, search: search || undefined, sort: 'name' });
  const { data: permissionsData } = permissionsApi.useList({ limit: 100, sort: 'module' });
  const createMutation = rolesApi.useCreate();
  const updateMutation = rolesApi.useUpdate();
  const removeMutation = rolesApi.useRemove();

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
        ? { name: row.name, description: row.description ?? '', permissions: (row.permissions ?? []).map((p) => (typeof p === 'string' ? p : p._id)) }
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
  const permissions = permissionsData?.items ?? [];
  const isEditingSystemRole = Boolean(editing?.isSystem);

  return (
    <>
      <Seo title="Roles" noIndex />
      <div className="flex flex-col gap-6">
        <AdminPageHeader
          title="Roles"
          description="Roles bundle permissions together — assign a role to each user."
          action={
            <PermissionGate permission="roles:manage">
              <Button onClick={() => openDrawer(null)}>
                <Plus size={18} aria-hidden="true" />
                Add role
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
          emptyIcon={ShieldCheck}
          emptyTitle="No roles yet"
          columns={[
            {
              key: 'name',
              header: 'Name',
              render: (row) => (
                <span className="flex items-center gap-1.5">
                  {row.name}
                  {row.isSystem && <Lock size={12} className="text-neutral-600" aria-label="System role" />}
                </span>
              ),
            },
            { key: 'permissions', header: 'Permissions', render: (row) => (row.isSystem ? 'All' : (row.permissions?.length ?? 0)) },
          ]}
          renderActions={(row) => (
            <div className="flex justify-end gap-1">
              <PermissionGate permission="roles:manage">
                <button type="button" onClick={() => openDrawer(row)} aria-label="Edit" className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100">
                  <Pencil size={15} aria-hidden="true" />
                </button>
                {!row.isSystem && (
                  <button type="button" onClick={() => setDeleteTarget(row)} aria-label="Delete" className="flex h-8 w-8 items-center justify-center rounded-md text-danger-700 hover:bg-danger-500/10">
                    <Trash2 size={15} aria-hidden="true" />
                  </button>
                )}
              </PermissionGate>
            </div>
          )}
        />
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit role' : 'Add role'}
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
            label="Name"
            {...register('name')}
            error={errors.name?.message}
            disabled={isEditingSystemRole}
            hint={isEditingSystemRole ? 'System roles cannot be renamed' : undefined}
          />
          <FormTextarea label="Description" {...register('description')} />

          {isEditingSystemRole ? (
            <p className="rounded-md bg-neutral-100 p-3 text-body-sm text-neutral-600">
              This is a system role with full access to every module — its permissions cannot be changed.
            </p>
          ) : (
            <div>
              <p className="mb-1.5 text-body-sm font-medium text-neutral-900">Permissions</p>
              <Controller
                name="permissions"
                control={control}
                render={({ field }) => (
                  <div className="flex max-h-72 flex-col gap-1 overflow-y-auto rounded-md border border-neutral-200 p-3">
                    {permissions.map((perm) => {
                      const checked = field.value?.includes(perm._id);
                      return (
                        <label key={perm._id} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-body-sm text-neutral-900 hover:bg-neutral-100">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              field.onChange(checked ? field.value.filter((id) => id !== perm._id) : [...(field.value ?? []), perm._id])
                            }
                            className="h-4 w-4 rounded border-neutral-200"
                          />
                          <span className="capitalize">{perm.module.replace(/-/g, ' ')}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              />
            </div>
          )}
        </form>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete role?"
        description={`"${deleteTarget?.name}" will be removed. Users assigned to it should be reassigned first.`}
        isLoading={removeMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => removeMutation.mutateAsync(deleteTarget._id).then(() => setDeleteTarget(null))}
      />
    </>
  );
}
