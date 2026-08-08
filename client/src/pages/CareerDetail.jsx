import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { CheckCircle2, Send, FileQuestion, Upload } from 'lucide-react';
import { api } from '../lib/axios';
import { useSubmitJobApplication } from '../api/jobApplicationSubmit.api';
import { Seo } from '../components/ui/Seo';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { notify } from '../lib/toast';

function useCareerDetail(slug) {
  return useQuery({
    queryKey: ['public', 'careers', 'detail', slug],
    queryFn: () => api.get(`/careers/public/${slug}`).then((envelope) => envelope.data),
    retry: false,
  });
}

const schema = z.object({
  fullName: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().min(6, 'A valid phone number is required'),
  coverLetter: z.string().trim().optional(),
  linkedinUrl: z.string().trim().optional(),
  portfolioUrl: z.string().trim().optional(),
});

export default function CareerDetail() {
  const { slug } = useParams();
  const { data: job, isLoading, isError } = useCareerDetail(slug);
  const reveal = useScrollReveal();

  if (isLoading) {
    return (
      <Container className="flex flex-col gap-6 py-16">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </Container>
    );
  }

  if (isError || !job) {
    return (
      <Container className="py-16">
        <EmptyState icon={FileQuestion} title="This opening is no longer available" headingLevel={1} action={<Button to="/careers">Back to Careers</Button>} />
      </Container>
    );
  }

  return (
    <>
      <Seo title={job.title} description={job.description?.slice(0, 160)} />
      <Container className="mx-auto max-w-3xl py-16">
        <motion.div {...reveal} className="flex flex-col gap-6">
          <div>
            <h1 className="font-heading text-h1 text-neutral-900">{job.title}</h1>
            <p className="mt-2 text-body-lg text-neutral-600">
              {job.department} · {job.location}
            </p>
          </div>

          <p className="whitespace-pre-wrap text-body-lg text-neutral-900">{job.description}</p>

          {job.responsibilities?.length > 0 && (
            <div>
              <h2 className="font-heading text-h4 text-neutral-900">Responsibilities</h2>
              <ul className="mt-2 flex flex-col gap-1.5 text-body-sm text-neutral-900">
                {job.responsibilities.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          )}

          {job.requirements?.length > 0 && (
            <div>
              <h2 className="font-heading text-h4 text-neutral-900">Requirements</h2>
              <ul className="mt-2 flex flex-col gap-1.5 text-body-sm text-neutral-900">
                {job.requirements.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          )}

          <ApplicationForm jobId={job._id} />
        </motion.div>
      </Container>
    </>
  );
}

function ApplicationForm({ jobId }) {
  const submit = useSubmitJobApplication();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ resolver: zodResolver(schema) });

  function onSubmit(values) {
    const fileInput = document.getElementById('resume-file');
    const file = fileInput?.files?.[0];
    if (!file) {
      notify.error('Please attach your resume');
      return;
    }

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    formData.append('job', jobId);
    formData.append('resume', file);

    submit.mutate(formData, {
      onSuccess: () => {
        reset();
        if (fileInput) fileInput.value = '';
      },
      onError: (err) => notify.error(err.message || 'Failed to submit application'),
    });
  }

  return (
    <Card className="p-6 sm:p-8">
      <h2 className="font-heading text-h3 text-neutral-900">Apply for this role</h2>

      {isSubmitSuccessful && !submit.isPending ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <CheckCircle2 size={36} className="text-success-500" aria-hidden="true" />
          <p className="text-body-lg font-medium text-neutral-900">Application submitted!</p>
          <p className="text-body-sm text-neutral-600">We&rsquo;ll be in touch if there&rsquo;s a match.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="mb-1.5 block text-body-sm font-medium text-neutral-900">
                Full name
              </label>
              <input id="fullName" {...register('fullName')} className="h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20" />
              {errors.fullName && <p className="mt-1 text-caption text-danger-700">{errors.fullName.message}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-body-sm font-medium text-neutral-900">
                Phone
              </label>
              <input id="phone" type="tel" {...register('phone')} className="h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20" />
              {errors.phone && <p className="mt-1 text-caption text-danger-700">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-body-sm font-medium text-neutral-900">
              Email
            </label>
            <input id="email" type="email" {...register('email')} className="h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20" />
            {errors.email && <p className="mt-1 text-caption text-danger-700">{errors.email.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="linkedinUrl" className="mb-1.5 block text-body-sm font-medium text-neutral-900">
                LinkedIn (optional)
              </label>
              <input id="linkedinUrl" {...register('linkedinUrl')} className="h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20" />
            </div>
            <div>
              <label htmlFor="portfolioUrl" className="mb-1.5 block text-body-sm font-medium text-neutral-900">
                Portfolio (optional)
              </label>
              <input id="portfolioUrl" {...register('portfolioUrl')} className="h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20" />
            </div>
          </div>

          <div>
            <label htmlFor="coverLetter" className="mb-1.5 block text-body-sm font-medium text-neutral-900">
              Cover letter (optional)
            </label>
            <textarea id="coverLetter" rows={4} {...register('coverLetter')} className="w-full resize-y rounded-md border border-neutral-200 bg-neutral-0 px-3 py-2.5 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20" />
          </div>

          <div>
            <label htmlFor="resume-file" className="mb-1.5 block text-body-sm font-medium text-neutral-900">
              Resume (PDF or Word)
            </label>
            <div className="flex items-center gap-2 rounded-md border border-dashed border-neutral-200 px-3 py-2.5">
              <Upload size={16} className="text-neutral-600" aria-hidden="true" />
              <input id="resume-file" type="file" accept=".pdf,.doc,.docx" required className="w-full text-body-sm text-neutral-900" />
            </div>
          </div>

          <Button type="submit" disabled={submit.isPending} className="mt-2 w-fit">
            <Send size={18} aria-hidden="true" />
            {submit.isPending ? 'Submitting…' : 'Submit application'}
          </Button>
        </form>
      )}
    </Card>
  );
}
