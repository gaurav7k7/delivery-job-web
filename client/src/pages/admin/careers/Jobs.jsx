import { z } from 'zod';
import { Controller } from 'react-hook-form';
import { Briefcase } from 'lucide-react';
import { SimpleResourceCrud } from '../../../components/admin/SimpleResourceCrud';
import { FormInput } from '../../../components/admin/form/FormInput';
import { FormTextarea } from '../../../components/admin/form/FormTextarea';
import { FormSelect } from '../../../components/admin/form/FormSelect';
import { FormArrayInput } from '../../../components/admin/form/FormArrayInput';
import { careersApi } from '../../../api/careers.api';

const schema = z.object({
  title: z.string().trim().min(2, 'Title is required'),
  department: z.string().trim().min(1, 'Department is required'),
  location: z.string().trim().min(1, 'Location is required'),
  employmentType: z.enum(['full_time', 'part_time', 'contract', 'internship']),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead']).optional(),
  description: z.string().trim().min(1, 'Description is required'),
  responsibilities: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  status: z.enum(['open', 'closed', 'draft']),
});

const defaultValues = {
  title: '',
  department: '',
  location: '',
  employmentType: 'full_time',
  experienceLevel: '',
  description: '',
  responsibilities: [],
  requirements: [],
  status: 'open',
};

export default function Jobs() {
  return (
    <SimpleResourceCrud
      api={careersApi}
      permission="careers:manage"
      seoTitle="Jobs"
      title="Job Openings"
      description="Career listings shown on the public careers page."
      itemLabel="Job opening"
      emptyIcon={Briefcase}
      listParams={{ limit: 10, sort: '-createdAt' }}
      schema={schema}
      defaultValues={defaultValues}
      columns={[
        { key: 'title', header: 'Title' },
        { key: 'department', header: 'Department' },
        { key: 'location', header: 'Location' },
        { key: 'status', header: 'Status', render: (row) => <span className="capitalize">{row.status}</span> },
      ]}
      renderFields={({ register, control, errors }) => (
        <>
          <FormInput label="Title" {...register('title')} error={errors.title?.message} />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Department" {...register('department')} error={errors.department?.message} />
            <FormInput label="Location" {...register('location')} error={errors.location?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect label="Employment type" {...register('employmentType')}>
              <option value="full_time">Full-time</option>
              <option value="part_time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </FormSelect>
            <FormSelect label="Experience level" {...register('experienceLevel')}>
              <option value="">— None —</option>
              <option value="entry">Entry</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
            </FormSelect>
          </div>
          <FormTextarea label="Description" {...register('description')} error={errors.description?.message} />
          <Controller
            name="responsibilities"
            control={control}
            render={({ field }) => <FormArrayInput label="Responsibilities" value={field.value} onChange={field.onChange} placeholder="Add a responsibility and press Enter" />}
          />
          <Controller
            name="requirements"
            control={control}
            render={({ field }) => <FormArrayInput label="Requirements" value={field.value} onChange={field.onChange} placeholder="Add a requirement and press Enter" />}
          />
          <FormSelect label="Status" {...register('status')}>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </FormSelect>
        </>
      )}
    />
  );
}
