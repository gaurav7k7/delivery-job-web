import { useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { useUploadMedia } from '../../../api/media.api';
import { FormField } from './FormField';
import { notify } from '../../../lib/toast';

export function ImageUploadField({ label, value, onChange, error, folder }) {
  const inputRef = useRef(null);
  const upload = useUploadMedia();

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('files', file);
    if (folder) formData.append('folder', folder);

    try {
      const [uploaded] = await upload.mutateAsync(formData);
      onChange({ url: uploaded.url, publicId: uploaded.publicId, alt: uploaded.altText || '' });
    } catch (err) {
      notify.error(err.message || 'Upload failed');
    } finally {
      e.target.value = '';
    }
  }

  return (
    <FormField label={label} error={error}>
      <div className="flex items-center gap-4">
        {value?.url ? (
          <div className="relative h-20 w-20 overflow-hidden rounded-md border border-neutral-200">
            <img src={value.url} alt={value.alt || ''} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900/70 text-neutral-0"
              aria-label="Remove image"
            >
              <X size={12} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-md border border-dashed border-neutral-200 text-neutral-600">
            <Upload size={20} aria-hidden="true" />
          </div>
        )}
        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={upload.isPending}
            className="flex items-center gap-2 rounded-md border border-neutral-200 px-3 py-2 text-body-sm font-medium text-neutral-900 hover:border-primary-500 disabled:opacity-60"
          >
            {upload.isPending ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <Upload size={14} aria-hidden="true" />}
            {upload.isPending ? 'Uploading…' : value?.url ? 'Replace' : 'Upload image'}
          </button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      </div>
    </FormField>
  );
}
