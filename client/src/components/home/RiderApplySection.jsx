import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { CheckCircle2, Send } from 'lucide-react';
import { usePublicContent } from '../../api/publicContent.api';
import { useSubmitRiderApplication } from '../../api/riderApplications.api';
import { Container } from '../ui/Container';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const VEHICLE_TYPES = [
  { value: 'bike', label: 'Motorbike' },
  { value: 'scooter', label: 'Scooter' },
  { value: 'bicycle', label: 'Bicycle' },
  { value: 'car', label: 'Car' },
  { value: 'on_foot', label: 'On foot' },
];

const schema = z.object({
  fullName: z.string().trim().min(2, 'Name is required'),
  phone: z.string().trim().min(6, 'A valid phone number is required'),
  email: z.string().trim().email('Enter a valid email address').optional().or(z.literal('')),
  city: z.string().trim().min(1, 'City is required'),
  vehicleType: z.string().optional(),
  preferredPlatforms: z.array(z.string()).optional(),
});

export function RiderApplySection() {
  const { data: platforms = [] } = usePublicContent('platforms');
  const submit = useSubmitRiderApplication();
  const reveal = useScrollReveal();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { preferredPlatforms: [] } });

  function onSubmit(values) {
    const payload = { ...values, email: values.email || undefined };
    submit.mutate(payload, { onSuccess: () => reset() });
  }

  return (
    <section id="apply" className="py-20">
      <Container>
        <motion.div {...reveal} className="mx-auto max-w-2xl">
          <Card className="p-8">
            <div className="mb-6 text-center">
              <h2 className="font-heading text-h2 text-neutral-900">Ready to start earning?</h2>
              <p className="mt-2 text-body-sm text-neutral-600">
                Fill in your details and our team will call you within 24 hours to get you onboarded.
              </p>
            </div>

            {isSubmitSuccessful && !submit.isPending ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <CheckCircle2 size={40} className="text-success-500" aria-hidden="true" />
                <p className="text-body-lg font-medium text-neutral-900">Application received!</p>
                <p className="text-body-sm text-neutral-600">Our team will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="fullName" className="mb-1.5 block text-body-sm font-medium text-neutral-900">
                      Full name
                    </label>
                    <input
                      id="fullName"
                      {...register('fullName')}
                      className="h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    />
                    {errors.fullName && <p className="mt-1 text-caption text-danger-700">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-1.5 block text-body-sm font-medium text-neutral-900">
                      Phone number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className="h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    />
                    {errors.phone && <p className="mt-1 text-caption text-danger-700">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="city" className="mb-1.5 block text-body-sm font-medium text-neutral-900">
                      City
                    </label>
                    <input
                      id="city"
                      {...register('city')}
                      className="h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    />
                    {errors.city && <p className="mt-1 text-caption text-danger-700">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="vehicleType" className="mb-1.5 block text-body-sm font-medium text-neutral-900">
                      Vehicle type
                    </label>
                    <select
                      id="vehicleType"
                      {...register('vehicleType')}
                      className="h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    >
                      <option value="">Select…</option>
                      {VEHICLE_TYPES.map((v) => (
                        <option key={v.value} value={v.value}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="mb-1.5 block text-body-sm font-medium text-neutral-900">
                    Email (optional)
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  />
                  {errors.email && <p className="mt-1 text-caption text-danger-700">{errors.email.message}</p>}
                </div>

                {platforms.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-body-sm font-medium text-neutral-900">Preferred platforms</p>
                    <div className="flex flex-wrap gap-2">
                      {platforms.map((platform) => (
                        <label
                          key={platform._id}
                          className="flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-caption text-neutral-900 has-checked:border-primary-500 has-checked:bg-primary-500/10"
                        >
                          <input type="checkbox" value={platform._id} {...register('preferredPlatforms')} className="sr-only" />
                          {platform.name}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <Button type="submit" size="lg" disabled={submit.isPending} className="mt-2">
                  <Send size={18} aria-hidden="true" />
                  {submit.isPending ? 'Submitting…' : 'Apply Now'}
                </Button>
              </form>
            )}
          </Card>
        </motion.div>
      </Container>
    </section>
  );
}
