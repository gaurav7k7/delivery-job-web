import { z } from 'zod';
import { BarChart3 } from 'lucide-react';
import { SimpleResourceCrud } from '../../../components/admin/SimpleResourceCrud';
import { FormInput } from '../../../components/admin/form/FormInput';
import { statisticsApi } from '../../../api/statistics.api';

const schema = z.object({
  label: z.string().trim().min(1, 'Label is required'),
  value: z.coerce.number(),
  prefix: z.string().trim().optional(),
  suffix: z.string().trim().optional(),
  icon: z.string().trim().optional(),
  order: z.coerce.number().optional(),
});

const defaultValues = { label: '', value: 0, prefix: '', suffix: '', icon: '', order: 0 };

export default function Statistics() {
  return (
    <SimpleResourceCrud
      api={statisticsApi}
      permission="statistics:manage"
      seoTitle="Statistics"
      title="Statistics"
      description="Animated counters shown on the homepage (riders onboarded, cities covered, etc.)."
      itemLabel="Statistic"
      itemNameField="label"
      emptyIcon={BarChart3}
      schema={schema}
      defaultValues={defaultValues}
      columns={[
        { key: 'label', header: 'Label' },
        { key: 'value', header: 'Value', render: (row) => `${row.prefix ?? ''}${row.value}${row.suffix ?? ''}` },
        { key: 'order', header: 'Order' },
      ]}
      renderFields={({ register, errors }) => (
        <>
          <FormInput label="Label" {...register('label')} error={errors.label?.message} />
          <FormInput label="Value" type="number" {...register('value')} error={errors.value?.message} />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Prefix" placeholder="e.g. ₹" {...register('prefix')} />
            <FormInput label="Suffix" placeholder="e.g. +" {...register('suffix')} />
          </div>
          <FormInput label="Icon" hint="e.g. rocket, users, truck, shield, star, award, clock (curated set)" {...register('icon')} />
          <FormInput label="Order" type="number" {...register('order')} error={errors.order?.message} />
        </>
      )}
    />
  );
}
