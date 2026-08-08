import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Seo } from '../../components/ui/Seo';
import { Button } from '../../components/ui/Button';
import { useLogin } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });

  useEffect(() => {
    if (login.isSuccess) {
      navigate(location.state?.from?.pathname ?? '/admin', { replace: true });
    }
  }, [login.isSuccess, navigate, location.state]);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <>
      <Seo title="Admin Login" noIndex />
      <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm rounded-lg border border-neutral-200 bg-neutral-0 p-8 shadow-[var(--shadow-elevation-3)]"
        >
          <div className="text-center">
            <h1 className="font-heading text-h3 font-bold text-gradient-brand">Zerivon</h1>
            <p className="mt-1 text-body-sm text-neutral-600">Sign in to the admin console</p>
          </div>

          <form onSubmit={handleSubmit((data) => login.mutate(data))} className="mt-8 flex flex-col gap-4" noValidate>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-body-sm font-medium text-neutral-900">
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-600" />
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  {...register('email')}
                  className="h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 pl-10 pr-3 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="mt-1 text-caption text-danger-700">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-body-sm font-medium text-neutral-900">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-600" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password')}
                  className="h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 pl-10 pr-3 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1 text-caption text-danger-700">
                  {errors.password.message}
                </p>
              )}
            </div>

            {login.isError && (
              <p role="alert" className="rounded-md bg-danger-500/10 px-3 py-2 text-body-sm text-danger-700">
                {login.error.message}
              </p>
            )}

            <Button type="submit" disabled={login.isPending} className="mt-2 w-full justify-center">
              <LogIn size={18} aria-hidden="true" />
              {login.isPending ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </motion.div>
      </div>
    </>
  );
}
