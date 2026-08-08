import { z } from 'zod';
import { Controller } from 'react-hook-form';
import { Building2 } from 'lucide-react';
import { SimpleResourceCrud } from '../../../components/admin/SimpleResourceCrud';
import { FormInput } from '../../../components/admin/form/FormInput';
import { ImageUploadField } from '../../../components/admin/form/ImageUploadField';
import { clientsApi } from '../../../api/clients.api';

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  logo: z.object({ url: z.string().min(1, 'Logo is required'), publicId: z.string().optional(), alt: z.string().optional() }),
  websiteUrl: z.string().trim().optional(),
  order: z.coerce.number().optional(),
});

const defaultValues = { name: '', logo: null, websiteUrl: '', order: 0 };

export default function Clients() {
  return (
    <SimpleResourceCrud
      api={clientsApi}
      permission="clients:manage"
      seoTitle="Clients"
      title="Clients"
      description="Client logos shown on the homepage."
      itemLabel="Client"
      emptyIcon={Building2}
      schema={schema}
      defaultValues={defaultValues}
      columns={[
        {
          key: 'logo',
          header: '',
          render: (row) => (
            <div className="flex h-10 w-16 items-center justify-center overflow-hidden rounded bg-neutral-100">
              {row.logo?.url && <img src={row.logo.url} alt="" className="h-full w-full object-contain" />}
            </div>
          ),
        },
        { key: 'name', header: 'Name' },
        { key: 'order', header: 'Order' },
      ]}
      renderFields={({ register, control, errors }) => (
        <>
          <Controller
            name="logo"
            control={control}
            render={({ field }) => (
              <ImageUploadField label="Logo" value={field.value} onChange={field.onChange} folder="zerivon/clients" error={errors.logo?.url?.message || errors.logo?.message} />
            )}
          />
          <FormInput label="Name" {...register('name')} error={errors.name?.message} />
          <FormInput label="Website URL" {...register('websiteUrl')} />
          <FormInput label="Order" type="number" {...register('order')} />
        </>
      )}
    />
  );
}
