import { z } from 'zod';
import { Sparkles } from 'lucide-react';
import { SimpleResourceCrud } from '../../../components/admin/SimpleResourceCrud';
import { FormInput } from '../../../components/admin/form/FormInput';
import { FormTextarea } from '../../../components/admin/form/FormTextarea';
import { benefitsApi } from '../../../api/benefits.api';

const schema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().min(1, 'Description is required'),
  icon: z.string().trim().optional(),
  order: z.coerce.number().optional(),
});

const defaultValues = { title: '', description: '', icon: '', order: 0 };

export default function Benefits() {
  return (
    <SimpleResourceCrud
      api={benefitsApi}
      permission="benefits:manage"
      seoTitle="Benefits"
      title="Benefits"
      description="“Why Choose Us” benefit cards shown on the homepage."
      itemLabel="Benefit"
      emptyIcon={Sparkles}
      schema={schema}
      defaultValues={defaultValues}
      columns={[
        { key: 'title', header: 'Title' },
        { key: 'description', header: 'Description', render: (row) => <span className="line-clamp-1 max-w-xs">{row.description}</span> },
        { key: 'order', header: 'Order' },
      ]}
      renderFields={({ register, errors }) => (
        <>
          <FormInput label="Title" {...register('title')} error={errors.title?.message} />
          <FormTextarea label="Description" {...register('description')} error={errors.description?.message} />
          <FormInput label="Icon" hint="e.g. rocket, users, truck, shield, star, award, clock (curated set)" {...register('icon')} />
          <FormInput label="Order" type="number" {...register('order')} error={errors.order?.message} />
        </>
      )}
    />
  );
}
