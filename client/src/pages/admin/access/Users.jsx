import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { Plus, Pencil, Trash2, UserCircle } from 'lucide-react';
import { Seo } from '../../../components/ui/Seo';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { DataTable } from '../../../components/admin/DataTable';
import { Drawer } from '../../../components/ui/Drawer';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { Button } from '../../../components/ui/Button';
import { FormInput } from '../../../components/admin/form/FormInput';
import { FormSelect } from '../../../components/admin/form/FormSelect';
import { FormSwitch } from '../../../components/admin/form/FormSwitch';
import { PermissionGate } from '../../../components/admin/PermissionGate';
import { usersApi } from '../../../api/users.api';
import { rolesApi } from '../../../api/roles.api';
import { useAuthStore } from '../../../store/authStore';

const createSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().trim().optional(),
  role: z.string().trim().min(1, 'Role is required'),
  isActive: z.boolean().optional(),
});

const updateSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  phone: z.string().trim().optional(),
  role: z.string().trim().min(1, 'Role is required'),
  isActive: z.boolean().optional(),
});

const emptyValues = { name: '', email: '', password: '', phone: '', role: '', isActive: true };

export default function Users() {
  const currentUser = useAuthStore((s) => s.user);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = usersApi.useList({ page, limit: 10, search: search || undefined, sort: '-createdAt' });
  const { data: rolesData } = rolesApi.useList({ limit: 50, sort: 'name' });
  const createMutation = usersApi.useCreate();
  const updateMutation = usersApi.useUpdate();
  const removeMutation = usersApi.useRemove();

  // No zodResolver here on purpose: react-hook-form captures the resolver
  // passed to useForm() once and doesn't reliably re-read it when `editing`
  // flips between renders, so a create/update schema swap driven by state
  // would validate against a stale schema. Validating manually inside
  // onSubmit (which reads `editing` fresh via closure) sidesteps that.
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm({ defaultValues: emptyValues });

  function openDrawer(row) {
    setEditing(row ?? null);
    reset(
      row
        ? { ...emptyValues, name: row.name, phone: row.phone ?? '', role: row.role?._id ?? row.role ?? '', isActive: row.isActive }
        : emptyValues
    );
    setDrawerOpen(true);
  }

  function onSubmit(values) {
    const schema = editing ? updateSchema : createSchema;
    const result = schema.safeParse(values);
    if (!result.success) {
      for (const issue of result.error.issues) {
        setError(issue.path[0], { message: issue.message });
      }
      return;
    }

    const action = editing
      ? updateMutation.mutateAsync({ id: editing._id, payload: result.data })
      : createMutation.mutateAsync(result.data);
    action.then(() => setDrawerOpen(false));
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const roles = rolesData?.items ?? [];

  return (
    <>
      <Seo title="Users" noIndex />
      <div className="flex flex-col gap-6">
        <AdminPageHeader
          title="Admin Users"
          description="People with access to this admin panel."
          action={
            <PermissionGate permission="users:manage">
              <Button onClick={() => openDrawer(null)}>
                <Plus size={18} aria-hidden="true" />
                Add user
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
          emptyIcon={UserCircle}
          emptyTitle="No users yet"
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'email', header: 'Email' },
            { key: 'role', header: 'Role', render: (row) => row.role?.name ?? '—' },
            { key: 'isActive', header: 'Status', render: (row) => (row.isActive ? 'Active' : 'Inactive') },
          ]}
          renderActions={(row) => (
            <div className="flex justify-end gap-1">
              <PermissionGate permission="users:manage">
                <button type="button" onClick={() => openDrawer(row)} aria-label="Edit" className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100">
                  <Pencil size={15} aria-hidden="true" />
                </button>
                {row._id !== currentUser?.id && (
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
        title={editing ? 'Edit user' : 'Add user'}
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
          <FormInput label="Name" {...register('name')} error={errors.name?.message} />
          {!editing && <FormInput label="Email" type="email" {...register('email')} error={errors.email?.message} />}
          {!editing && (
            <FormInput label="Password" type="password" {...register('password')} error={errors.password?.message} hint="At least 8 characters" />
          )}
          <FormInput label="Phone" {...register('phone')} />
          <FormSelect label="Role" {...register('role')} error={errors.role?.message}>
            <option value="">Select a role…</option>
            {roles.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </FormSelect>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => <FormSwitch label="Active" checked={field.value} onChange={field.onChange} />}
          />
        </form>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete user?"
        description={`"${deleteTarget?.name}" will lose access to the admin panel.`}
        isLoading={removeMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => removeMutation.mutateAsync(deleteTarget._id).then(() => setDeleteTarget(null))}
      />
    </>
  );
}
