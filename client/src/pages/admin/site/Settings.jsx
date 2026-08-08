import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';
import { Seo } from '../../../components/ui/Seo';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { FormInput } from '../../../components/admin/form/FormInput';
import { FormTextarea } from '../../../components/admin/form/FormTextarea';
import { FormSwitch } from '../../../components/admin/form/FormSwitch';
import { FormArrayInput } from '../../../components/admin/form/FormArrayInput';
import { ImageUploadField } from '../../../components/admin/form/ImageUploadField';
import { useSiteSettings } from '../../../api/settings.api';
import { useUpdateSiteSettings } from '../../../api/settingsAdmin.api';

const schema = z.object({
  siteName: z.string().trim().min(1, 'Site name is required'),
  tagline: z.string().trim().optional(),
  logo: z.object({ url: z.string(), publicId: z.string().optional(), alt: z.string().optional() }).nullable().optional(),
  favicon: z.object({ url: z.string(), publicId: z.string().optional(), alt: z.string().optional() }).nullable().optional(),
  themeColors: z.object({
    primary: z.string().trim().optional(),
    secondary: z.string().trim().optional(),
    accent: z.string().trim().optional(),
    background: z.string().trim().optional(),
    text: z.string().trim().optional(),
  }),
  contact: z.object({
    phones: z.array(z.string()).optional(),
    whatsapp: z.string().trim().optional(),
    email: z.string().trim().optional(),
    addressLine: z.string().trim().optional(),
  }),
  businessHours: z.string().trim().optional(),
  analytics: z.object({
    googleAnalyticsId: z.string().trim().optional(),
    googleTagManagerId: z.string().trim().optional(),
    metaPixelId: z.string().trim().optional(),
  }),
  recaptchaSiteKey: z.string().trim().optional(),
  maintenanceMode: z.object({
    enabled: z.boolean().optional(),
    message: z.string().trim().optional(),
  }),
});

const emptyValues = {
  siteName: '',
  tagline: '',
  logo: null,
  favicon: null,
  themeColors: { primary: '', secondary: '', accent: '', background: '', text: '' },
  contact: { phones: [], whatsapp: '', email: '', addressLine: '' },
  businessHours: '',
  analytics: { googleAnalyticsId: '', googleTagManagerId: '', metaPixelId: '' },
  recaptchaSiteKey: '',
  maintenanceMode: { enabled: false, message: '' },
};

export default function Settings() {
  const { data: settings, isLoading } = useSiteSettings();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  return <SettingsForm initialValues={settings} />;
}

// Mounted only once `settings` has loaded, so defaultValues can be set
// directly from the fetched document via useForm's lazy init — no effect
// needed to sync it in after the fact.
function SettingsForm({ initialValues }) {
  const updateSettings = useUpdateSiteSettings();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { ...emptyValues, ...initialValues } });

  return (
    <>
      <Seo title="Site Settings" noIndex />
      <form onSubmit={handleSubmit((values) => updateSettings.mutate(values))} noValidate className="flex flex-col gap-6">
        <AdminPageHeader
          title="Site Settings"
          description="Company details, branding, and integrations used across the whole site."
          action={
            <Button type="submit" disabled={updateSettings.isPending}>
              <Save size={18} aria-hidden="true" />
              {updateSettings.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          }
        />

        <Card className="flex flex-col gap-4 p-6">
          <h3 className="font-heading text-h4 text-neutral-900">Branding</h3>
          <Controller
            name="logo"
            control={control}
            render={({ field }) => <ImageUploadField label="Logo" value={field.value} onChange={field.onChange} folder="zerivon/branding" />}
          />
          <Controller
            name="favicon"
            control={control}
            render={({ field }) => <ImageUploadField label="Favicon" value={field.value} onChange={field.onChange} folder="zerivon/branding" />}
          />
          <FormInput label="Site name" {...register('siteName')} error={errors.siteName?.message} />
          <FormInput label="Tagline" {...register('tagline')} />
        </Card>

        <Card className="flex flex-col gap-4 p-6">
          <h3 className="font-heading text-h4 text-neutral-900">Theme colors</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <FormInput label="Primary" placeholder="#4F46E5" {...register('themeColors.primary')} />
            <FormInput label="Secondary" placeholder="#7C6FF0" {...register('themeColors.secondary')} />
            <FormInput label="Accent" placeholder="#F97316" {...register('themeColors.accent')} />
            <FormInput label="Background" placeholder="#FFFFFF" {...register('themeColors.background')} />
            <FormInput label="Text" placeholder="#111827" {...register('themeColors.text')} />
          </div>
        </Card>

        <Card className="flex flex-col gap-4 p-6">
          <h3 className="font-heading text-h4 text-neutral-900">Contact information</h3>
          <Controller
            name="contact.phones"
            control={control}
            render={({ field }) => <FormArrayInput label="Phone numbers" value={field.value} onChange={field.onChange} placeholder="Add a phone number and press Enter" />}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="WhatsApp number" {...register('contact.whatsapp')} />
            <FormInput label="Contact email" {...register('contact.email')} />
          </div>
          <FormInput label="Address" {...register('contact.addressLine')} />
          <FormInput label="Business hours" placeholder="Mon-Sat, 9am-7pm" {...register('businessHours')} />
        </Card>

        <Card className="flex flex-col gap-4 p-6">
          <h3 className="font-heading text-h4 text-neutral-900">Analytics & integrations</h3>
          <div className="grid grid-cols-3 gap-4">
            <FormInput label="Google Analytics ID" {...register('analytics.googleAnalyticsId')} />
            <FormInput label="Google Tag Manager ID" {...register('analytics.googleTagManagerId')} />
            <FormInput label="Meta Pixel ID" {...register('analytics.metaPixelId')} />
          </div>
          <FormInput label="reCAPTCHA site key" {...register('recaptchaSiteKey')} />
        </Card>

        <Card className="flex flex-col gap-4 p-6">
          <h3 className="font-heading text-h4 text-neutral-900">Maintenance mode</h3>
          <Controller
            name="maintenanceMode.enabled"
            control={control}
            render={({ field }) => (
              <FormSwitch label="Enable maintenance mode" checked={field.value} onChange={field.onChange} hint="Hides the public site behind a maintenance message" />
            )}
          />
          <FormTextarea label="Maintenance message" {...register('maintenanceMode.message')} />
        </Card>
      </form>
    </>
  );
}
