import { z } from 'zod';
import { Controller } from 'react-hook-form';
import { Menu } from 'lucide-react';
import { SimpleResourceCrud } from '../../../components/admin/SimpleResourceCrud';
import { FormInput } from '../../../components/admin/form/FormInput';
import { FormSelect } from '../../../components/admin/form/FormSelect';
import { FormLinkListInput } from '../../../components/admin/form/FormLinkListInput';
import { navigationAdminApi } from '../../../api/navigationAdmin.api';

const LOCATIONS = ['header', 'footer', 'admin_sidebar', 'mobile'];

const linkSchema = z.object({ label: z.string().trim().min(1), url: z.string().trim().min(1) });

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  location: z.enum(LOCATIONS),
  items: z.array(linkSchema).optional(),
});

const defaultValues = { name: '', location: 'header', items: [] };

export default function Navigation() {
  return (
    <SimpleResourceCrud
      api={navigationAdminApi}
      permission="navigation:manage"
      seoTitle="Navigation"
      title="Navigation Menus"
      description="The site's header, footer, and mobile menus. Only the public header menu (location = header) is wired into the live site currently."
      itemLabel="Menu"
      emptyIcon={Menu}
      schema={schema}
      defaultValues={defaultValues}
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'location', header: 'Location' },
        { key: 'items', header: 'Items', render: (row) => row.items?.length ?? 0 },
      ]}
      renderFields={({ register, control, errors }) => (
        <>
          <FormInput label="Name" {...register('name')} error={errors.name?.message} />
          <FormSelect label="Location" {...register('location')}>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </FormSelect>
          <Controller
            name="items"
            control={control}
            render={({ field }) => <FormLinkListInput label="Menu items" value={field.value} onChange={field.onChange} />}
          />
        </>
      )}
    />
  );
}
