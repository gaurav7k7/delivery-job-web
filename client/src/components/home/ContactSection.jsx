import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { CheckCircle2, Send, MapPin, Phone, Mail } from 'lucide-react';
import { usePublicContent } from '../../api/publicContent.api';
import { useSubmitContactRequest } from '../../api/contactRequests.api';
import { useSiteSettings } from '../../api/settings.api';
import { Container } from '../ui/Container';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SectionHeading } from './SectionHeading';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const schema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().optional(),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(2, 'Message is required').max(2000),
});

export function ContactSection() {
  const { data: offices = [] } = usePublicContent('offices');
  const { data: settings } = useSiteSettings();
  const submit = useSubmitContactRequest();
  const reveal = useScrollReveal();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ resolver: zodResolver(schema) });

  function onSubmit(values) {
    submit.mutate(values, { onSuccess: () => reset() });
  }

  const headOffice = offices.find((o) => o.isHeadOffice) ?? offices[0];

  return (
    <section id="contact" className="py-20">
      <Container className="grid gap-12 lg:grid-cols-2">
        <motion.div {...reveal} className="flex flex-col gap-6">
          <SectionHeading eyebrow="Get In Touch" title="Have a question? Talk to our team" align="left" />

          <div className="flex flex-col gap-4">
            {settings?.contact?.phones?.[0] && (
              <a href={`tel:${settings.contact.phones[0]}`} className="flex items-center gap-3 text-body-sm text-neutral-900">
                <Phone size={18} className="text-primary-500" aria-hidden="true" />
                {settings.contact.phones[0]}
              </a>
            )}
            {settings?.contact?.email && (
              <a href={`mailto:${settings.contact.email}`} className="flex items-center gap-3 text-body-sm text-neutral-900">
                <Mail size={18} className="text-primary-500" aria-hidden="true" />
                {settings.contact.email}
              </a>
            )}
            {headOffice && (
              <p className="flex items-start gap-3 text-body-sm text-neutral-900">
                <MapPin size={18} className="mt-0.5 shrink-0 text-primary-500" aria-hidden="true" />
                {[headOffice.addressLine, headOffice.city, headOffice.state, headOffice.pincode].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
        </motion.div>

        <Card className="p-6 sm:p-8">
          {isSubmitSuccessful && !submit.isPending ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <CheckCircle2 size={36} className="text-success-500" aria-hidden="true" />
              <p className="text-body-lg font-medium text-neutral-900">Message sent!</p>
              <p className="text-body-sm text-neutral-600">We&rsquo;ll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-body-sm font-medium text-neutral-900">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    {...register('name')}
                    className="h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  />
                  {errors.name && <p className="mt-1 text-caption text-danger-700">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-body-sm font-medium text-neutral-900">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    {...register('email')}
                    className="h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  />
                  {errors.email && <p className="mt-1 text-caption text-danger-700">{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="contact-subject" className="mb-1.5 block text-body-sm font-medium text-neutral-900">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  {...register('subject')}
                  className="h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-body-sm font-medium text-neutral-900">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  {...register('message')}
                  className="w-full resize-y rounded-md border border-neutral-200 bg-neutral-0 px-3 py-2.5 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
                {errors.message && <p className="mt-1 text-caption text-danger-700">{errors.message.message}</p>}
              </div>
              <Button type="submit" disabled={submit.isPending} className="mt-2 w-fit">
                <Send size={18} aria-hidden="true" />
                {submit.isPending ? 'Sending…' : 'Send message'}
              </Button>
            </form>
          )}
        </Card>
      </Container>
    </section>
  );
}
