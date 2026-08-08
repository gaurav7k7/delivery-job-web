import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';
import { Seo } from '../../components/ui/Seo';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useUpdateProfile } from '../../api/auth.api';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
});

function getInitials(name = '') {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
}

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({ resolver: zodResolver(profileSchema), defaultValues: { name: user?.name, email: user?.email } });

  return (
    <>
      <Seo title="Profile" noIndex />
      <div className="mx-auto max-w-2xl">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-500 text-h4 font-semibold text-[var(--color-on-primary)]">
              {getInitials(user?.name)}
            </span>
            <div>
              <p className="font-heading text-h4 text-neutral-900">{user?.name}</p>
              <p className="text-body-sm text-neutral-600">{user?.role?.name}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit((data) => updateProfile.mutate(data))} className="mt-8 flex flex-col gap-4" noValidate>
            <div>
              <label htmlFor="name" className="mb-1.5 block text-body-sm font-medium text-neutral-900">
                Full name
              </label>
              <input
                id="name"
                {...register('name')}
                className="h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <p className="mt-1 text-caption text-danger-700">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-body-sm font-medium text-neutral-900">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && <p className="mt-1 text-caption text-danger-700">{errors.email.message}</p>}
            </div>

            <Button type="submit" disabled={!isDirty || updateProfile.isPending} className="mt-2 w-fit">
              <Save size={18} aria-hidden="true" />
              {updateProfile.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
