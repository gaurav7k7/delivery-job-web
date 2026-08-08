import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { KeyRound } from 'lucide-react';
import { Seo } from '../../components/ui/Seo';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useChangePassword } from '../../api/auth.api';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function ChangePassword() {
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(passwordSchema) });

  function onSubmit(data) {
    changePassword.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => reset(),
        onError: (err) => {
          if (err.fieldErrors?.currentPassword) {
            setError('currentPassword', { message: err.fieldErrors.currentPassword });
          }
        },
      }
    );
  }

  return (
    <>
      <Seo title="Change Password" noIndex />
      <div className="mx-auto max-w-md">
        <Card className="p-6">
          <h2 className="font-heading text-h4 text-neutral-900">Change password</h2>
          <p className="mt-1 text-body-sm text-neutral-600">Use at least 8 characters. You&rsquo;ll stay signed in on this device.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
            <div>
              <label htmlFor="currentPassword" className="mb-1.5 block text-body-sm font-medium text-neutral-900">
                Current password
              </label>
              <input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                {...register('currentPassword')}
                className="h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                aria-invalid={Boolean(errors.currentPassword)}
              />
              {errors.currentPassword && <p className="mt-1 text-caption text-danger-700">{errors.currentPassword.message}</p>}
            </div>

            <div>
              <label htmlFor="newPassword" className="mb-1.5 block text-body-sm font-medium text-neutral-900">
                New password
              </label>
              <input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                {...register('newPassword')}
                className="h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                aria-invalid={Boolean(errors.newPassword)}
              />
              {errors.newPassword && <p className="mt-1 text-caption text-danger-700">{errors.newPassword.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-body-sm font-medium text-neutral-900">
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword')}
                className="h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                aria-invalid={Boolean(errors.confirmPassword)}
              />
              {errors.confirmPassword && <p className="mt-1 text-caption text-danger-700">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" disabled={changePassword.isPending} className="mt-2 w-fit">
              <KeyRound size={18} aria-hidden="true" />
              {changePassword.isPending ? 'Updating…' : 'Update password'}
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
