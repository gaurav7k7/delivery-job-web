import { z } from 'zod';
import { ListOrdered } from 'lucide-react';
import { SimpleResourceCrud } from '../../../components/admin/SimpleResourceCrud';
import { FormInput } from '../../../components/admin/form/FormInput';
import { FormTextarea } from '../../../components/admin/form/FormTextarea';
import { processStepsApi } from '../../../api/processSteps.api';

const schema = z.object({
  page: z.string().trim().min(1, 'Page is required'),
  stepNumber: z.coerce.number().int().positive(),
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().min(1, 'Description is required'),
  icon: z.string().trim().optional(),
  order: z.coerce.number().optional(),
});

const defaultValues = { page: 'how-it-works', stepNumber: 1, title: '', description: '', icon: '', order: 0 };

export default function ProcessSteps() {
  return (
    <SimpleResourceCrud
      api={processStepsApi}
      permission="process-steps:manage"
      seoTitle="Process Steps"
      title="Process Steps"
      description="The “How it works” steps shown on the homepage."
      itemLabel="Process step"
      emptyIcon={ListOrdered}
      listParams={{ limit: 20, sort: 'stepNumber' }}
      schema={schema}
      defaultValues={defaultValues}
      columns={[
        { key: 'stepNumber', header: 'Step #' },
        { key: 'title', header: 'Title' },
        { key: 'page', header: 'Page' },
      ]}
      renderFields={({ register, errors }) => (
        <>
          <FormInput label="Page" {...register('page')} error={errors.page?.message} />
          <FormInput label="Step number" type="number" {...register('stepNumber')} error={errors.stepNumber?.message} />
          <FormInput label="Title" {...register('title')} error={errors.title?.message} />
          <FormTextarea label="Description" {...register('description')} error={errors.description?.message} />
          <FormInput label="Icon" hint="e.g. rocket, users, truck, shield, star, award, clock (curated set)" {...register('icon')} />
          <FormInput label="Order" type="number" {...register('order')} />
        </>
      )}
    />
  );
}
