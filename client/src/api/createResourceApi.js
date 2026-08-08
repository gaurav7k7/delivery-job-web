import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { notify } from '../lib/toast';

/**
 * Every admin content module's backend was built with the same
 * repository + createCrudController + createCrudRoutes factories (see
 * server/src/routes/routeFactory.js) — list/create/update/toggle-status/
 * restore/delete[/bulk-delete][/reorder] at a consistent set of paths. This
 * is the frontend mirror: one call per module instead of hand-writing the
 * same eight hooks ~20 times.
 */
export function createResourceApi(resource, { label = resource } = {}) {
  const baseKey = [resource];

  function useList(params = {}) {
    return useQuery({
      queryKey: [...baseKey, 'list', params],
      queryFn: () =>
        api.get(`/${resource}`, { params }).then((envelope) => ({ items: envelope.data, meta: envelope.meta })),
      placeholderData: (prev) => prev,
    });
  }

  function useOne(id) {
    return useQuery({
      queryKey: [...baseKey, 'detail', id],
      queryFn: () => api.get(`/${resource}/${id}`).then((envelope) => envelope.data),
      enabled: Boolean(id),
    });
  }

  function useCreate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (payload) => api.post(`/${resource}`, payload).then((envelope) => envelope.data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: baseKey });
        notify.success(`${label} created`);
      },
    });
  }

  function useUpdate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, payload }) => api.patch(`/${resource}/${id}`, payload).then((envelope) => envelope.data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: baseKey });
        notify.success(`${label} updated`);
      },
    });
  }

  function useRemove() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id) => api.delete(`/${resource}/${id}`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: baseKey });
        notify.success(`${label} deleted`);
      },
    });
  }

  function useRestore() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id) => api.patch(`/${resource}/${id}/restore`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: baseKey });
        notify.success(`${label} restored`);
      },
    });
  }

  function useToggleStatus() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id) => api.patch(`/${resource}/${id}/toggle-status`),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: baseKey }),
    });
  }

  function useBulkRemove() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (ids) => api.post(`/${resource}/bulk-delete`, { ids }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: baseKey });
        notify.success(`${label} deleted`);
      },
    });
  }

  function useReorder() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (items) => api.post(`/${resource}/reorder`, { items }),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: baseKey }),
    });
  }

  return { useList, useOne, useCreate, useUpdate, useRemove, useRestore, useToggleStatus, useBulkRemove, useReorder };
}
