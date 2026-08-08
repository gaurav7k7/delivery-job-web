import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Seo } from '../../../components/ui/Seo';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { FormInput } from '../../../components/admin/form/FormInput';
import { FormTextarea } from '../../../components/admin/form/FormTextarea';
import { FormSwitch } from '../../../components/admin/form/FormSwitch';
import { FormLinkListInput } from '../../../components/admin/form/FormLinkListInput';
import { useFooterConfig } from '../../../api/footer.api';
import { useUpdateFooterConfig } from '../../../api/footerAdmin.api';

const columnSchema = z.object({
  title: z.string().trim().min(1, 'Column title is required'),
  links: z.array(z.object({ label: z.string().trim().min(1), url: z.string().trim().min(1) })).optional(),
});

const schema = z.object({
  columns: z.array(columnSchema).optional(),
  bottomText: z.string().trim().optional(),
  disclaimerText: z.string().trim().optional(),
  newsletterEnabled: z.boolean().optional(),
});

const emptyValues = { columns: [], bottomText: '', disclaimerText: '', newsletterEnabled: true };

export default function Footer() {
  const { data: footer, isLoading } = useFooterConfig();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  return <FooterForm initialValues={footer} />;
}

function FooterForm({ initialValues }) {
  const updateFooter = useUpdateFooterConfig();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { ...emptyValues, ...initialValues } });

  const columns = useFieldArray({ control, name: 'columns' });

  return (
    <>
      <Seo title="Footer" noIndex />
      <form onSubmit={handleSubmit((values) => updateFooter.mutate(values))} noValidate className="flex flex-col gap-6">
        <AdminPageHeader
          title="Footer"
          description="The columns and legal text shown in the site footer."
          action={
            <Button type="submit" disabled={updateFooter.isPending}>
              <Save size={18} aria-hidden="true" />
              {updateFooter.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          }
        />

        <Card className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-h4 text-neutral-900">Columns</h3>
            <Button type="button" variant="secondary" size="sm" onClick={() => columns.append({ title: '', links: [] })}>
              <Plus size={16} aria-hidden="true" />
              Add column
            </Button>
          </div>

          {columns.fields.map((field, index) => (
            <div key={field.key} className="flex flex-col gap-3 rounded-md border border-neutral-200 p-4">
              <div className="flex items-center gap-2">
                <FormInput
                  label="Column title"
                  {...register(`columns.${index}.title`)}
                  error={errors.columns?.[index]?.title?.message}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => columns.remove(index)}
                  aria-label="Remove column"
                  className="mt-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-danger-700 hover:bg-danger-500/10"
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </div>
              <Controller
                name={`columns.${index}.links`}
                control={control}
                render={({ field: linkField }) => (
                  <FormLinkListInput label="Links" value={linkField.value} onChange={linkField.onChange} />
                )}
              />
            </div>
          ))}
        </Card>

        <Card className="flex flex-col gap-4 p-6">
          <h3 className="font-heading text-h4 text-neutral-900">Legal text</h3>
          <FormTextarea label="Bottom text" rows={2} {...register('bottomText')} />
          <FormTextarea label="Disclaimer text" rows={2} {...register('disclaimerText')} />
          <Controller
            name="newsletterEnabled"
            control={control}
            render={({ field }) => <FormSwitch label="Show newsletter signup" checked={field.value} onChange={field.onChange} />}
          />
        </Card>
      </form>
    </>
  );
}
