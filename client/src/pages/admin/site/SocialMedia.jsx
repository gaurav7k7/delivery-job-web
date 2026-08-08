import { z } from 'zod';
import { Share2 } from 'lucide-react';
import { SimpleResourceCrud } from '../../../components/admin/SimpleResourceCrud';
import { FormInput } from '../../../components/admin/form/FormInput';
import { FormSelect } from '../../../components/admin/form/FormSelect';
import { socialLinksAdminApi } from '../../../api/socialLinksAdmin.api';

const PLATFORMS = ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'whatsapp', 'tiktok', 'pinterest', 'other'];

const schema = z.object({
  platform: z.enum(PLATFORMS),
  url: z.string().trim().min(1, 'URL is required'),
  order: z.coerce.number().optional(),
});

const defaultValues = { platform: 'instagram', url: '', order: 0 };

export default function SocialMedia() {
  return (
    <SimpleResourceCrud
      api={socialLinksAdminApi}
      permission="social-links:manage"
      seoTitle="Social Media"
      title="Social Media Links"
      description="Shown in the site footer and header."
      itemLabel="Social link"
      itemNameField="platform"
      emptyIcon={Share2}
      schema={schema}
      defaultValues={defaultValues}
      columns={[
        { key: 'platform', header: 'Platform', render: (row) => <span className="capitalize">{row.platform}</span> },
        { key: 'url', header: 'URL' },
        { key: 'order', header: 'Order' },
      ]}
      renderFields={({ register, errors }) => (
        <>
          <FormSelect label="Platform" {...register('platform')}>
            {PLATFORMS.map((p) => (
              <option key={p} value={p} className="capitalize">
                {p}
              </option>
            ))}
          </FormSelect>
          <FormInput label="URL" {...register('url')} error={errors.url?.message} />
          <FormInput label="Order" type="number" {...register('order')} />
        </>
      )}
    />
  );
}
