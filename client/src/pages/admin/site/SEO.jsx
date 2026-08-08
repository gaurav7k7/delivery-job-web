import { z } from 'zod';
import { Controller } from 'react-hook-form';
import { Search } from 'lucide-react';
import { SimpleResourceCrud } from '../../../components/admin/SimpleResourceCrud';
import { FormInput } from '../../../components/admin/form/FormInput';
import { FormTextarea } from '../../../components/admin/form/FormTextarea';
import { FormSwitch } from '../../../components/admin/form/FormSwitch';
import { FormArrayInput } from '../../../components/admin/form/FormArrayInput';
import { seoMetaAdminApi } from '../../../api/seoMeta.admin.api';

const schema = z.object({
  route: z.string().trim().min(1, 'Route is required'),
  seo: z.object({
    metaTitle: z.string().trim().max(70).optional(),
    metaDescription: z.string().trim().max(160).optional(),
    metaKeywords: z.array(z.string()).optional(),
    ogImage: z.string().trim().optional(),
    canonicalUrl: z.string().trim().optional(),
    noIndex: z.boolean().optional(),
  }),
});

const defaultValues = {
  route: '',
  seo: { metaTitle: '', metaDescription: '', metaKeywords: [], ogImage: '', canonicalUrl: '', noIndex: false },
};

export default function SEO() {
  return (
    <SimpleResourceCrud
      api={seoMetaAdminApi}
      permission="seo:manage"
      seoTitle="SEO"
      title="SEO Overrides"
      description="Per-route meta title, description, and social preview overrides."
      itemLabel="SEO entry"
      itemNameField="route"
      emptyIcon={Search}
      listParams={{ limit: 20, sort: 'route' }}
      schema={schema}
      defaultValues={defaultValues}
      columns={[
        { key: 'route', header: 'Route' },
        { key: 'metaTitle', header: 'Meta title', render: (row) => row.seo?.metaTitle ?? '—' },
        { key: 'noIndex', header: 'No-index', render: (row) => (row.seo?.noIndex ? 'Yes' : '—') },
      ]}
      renderFields={({ register, control, errors }) => (
        <>
          <FormInput label="Route" placeholder="/about" {...register('route')} error={errors.route?.message} />
          <FormInput label="Meta title" {...register('seo.metaTitle')} error={errors.seo?.metaTitle?.message} />
          <FormTextarea label="Meta description" {...register('seo.metaDescription')} error={errors.seo?.metaDescription?.message} />
          <Controller
            name="seo.metaKeywords"
            control={control}
            render={({ field }) => <FormArrayInput label="Keywords" value={field.value} onChange={field.onChange} placeholder="Add a keyword and press Enter" />}
          />
          <FormInput label="OG image URL" {...register('seo.ogImage')} />
          <FormInput label="Canonical URL" {...register('seo.canonicalUrl')} />
          <Controller
            name="seo.noIndex"
            control={control}
            render={({ field }) => <FormSwitch label="No-index" checked={field.value} onChange={field.onChange} hint="Hide this page from search engines" />}
          />
        </>
      )}
    />
  );
}
