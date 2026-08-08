import { useRef, useState } from 'react';
import { Upload, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Seo } from '../../components/ui/Seo';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { PermissionGate } from '../../components/admin/PermissionGate';
import { useMediaList, useUploadMediaFiles, useDeleteMedia } from '../../api/media.admin.api';
import { notify } from '../../lib/toast';

export default function MediaLibrary() {
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const inputRef = useRef(null);

  const { data, isLoading } = useMediaList({ page, limit: 24, sort: '-createdAt' });
  const upload = useUploadMediaFiles();
  const removeMutation = useDeleteMedia();

  async function handleFiles(e) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('folder', 'zerivon/media');

    try {
      await upload.mutateAsync(formData);
    } catch (err) {
      notify.error(err.message || 'Upload failed');
    } finally {
      e.target.value = '';
    }
  }

  const items = data?.items ?? [];

  return (
    <>
      <Seo title="Media Library" noIndex />
      <div className="flex flex-col gap-6">
        <AdminPageHeader
          title="Media Library"
          description="Images uploaded across the admin panel. Upload here to reuse an image across multiple content items."
          action={
            <PermissionGate permission="media:manage">
              <Button onClick={() => inputRef.current?.click()} disabled={upload.isPending}>
                {upload.isPending ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Upload size={18} aria-hidden="true" />}
                {upload.isPending ? 'Uploading…' : 'Upload images'}
              </Button>
              <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
            </PermissionGate>
          }
        />

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-lg" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState icon={ImageIcon} title="No media uploaded yet" description="Upload an image to get started." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {items.map((item) => (
              <Card key={item._id} className="group relative overflow-hidden p-0" hoverLift={false}>
                <div className="aspect-square overflow-hidden bg-neutral-100">
                  <img src={item.url} alt={item.altText || ''} className="h-full w-full object-cover" />
                </div>
                <PermissionGate permission="media:manage">
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    aria-label="Delete image"
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900/70 text-neutral-0 opacity-0 transition group-hover:opacity-100"
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </PermissionGate>
              </Card>
            ))}
          </div>
        )}

        {data?.meta && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-between text-caption text-neutral-600">
            <span>
              Page {data.meta.page} of {data.meta.totalPages}
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                Previous
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page >= data.meta.totalPages}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete image?"
        description="This removes it from the media library. Pages that already reference this image's URL will keep showing it."
        isLoading={removeMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => removeMutation.mutateAsync(deleteTarget._id).then(() => setDeleteTarget(null))}
      />
    </>
  );
}
