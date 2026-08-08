import { z } from 'zod';
import { Controller } from 'react-hook-form';
import { Users } from 'lucide-react';
import { SimpleResourceCrud } from '../../../components/admin/SimpleResourceCrud';
import { FormInput } from '../../../components/admin/form/FormInput';
import { FormTextarea } from '../../../components/admin/form/FormTextarea';
import { FormSwitch } from '../../../components/admin/form/FormSwitch';
import { ImageUploadField } from '../../../components/admin/form/ImageUploadField';
import { teamApi } from '../../../api/team.api';

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  designation: z.string().trim().min(1, 'Designation is required'),
  department: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  photo: z.object({ url: z.string(), publicId: z.string().optional(), alt: z.string().optional() }).nullable().optional(),
  order: z.coerce.number().optional(),
  isLeadership: z.boolean().optional(),
});

const defaultValues = { name: '', designation: '', department: '', bio: '', photo: null, order: 0, isLeadership: false };

export default function Team() {
  return (
    <SimpleResourceCrud
      api={teamApi}
      permission="team:manage"
      seoTitle="Team"
      title="Team Members"
      description="The people shown on the About page."
      itemLabel="Team member"
      emptyIcon={Users}
      schema={schema}
      defaultValues={defaultValues}
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'designation', header: 'Designation' },
        { key: 'isLeadership', header: 'Leadership', render: (row) => (row.isLeadership ? 'Yes' : '—') },
        { key: 'order', header: 'Order' },
      ]}
      renderFields={({ register, control, errors }) => (
        <>
          <Controller
            name="photo"
            control={control}
            render={({ field }) => <ImageUploadField label="Photo" value={field.value} onChange={field.onChange} folder="zerivon/team" />}
          />
          <FormInput label="Name" {...register('name')} error={errors.name?.message} />
          <FormInput label="Designation" {...register('designation')} error={errors.designation?.message} />
          <FormInput label="Department" {...register('department')} />
          <FormTextarea label="Bio" {...register('bio')} />
          <Controller
            name="isLeadership"
            control={control}
            render={({ field }) => <FormSwitch label="Leadership team" checked={field.value} onChange={field.onChange} />}
          />
          <FormInput label="Order" type="number" {...register('order')} />
        </>
      )}
    />
  );
}
