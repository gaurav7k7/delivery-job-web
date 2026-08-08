import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';

export function DataTable({
  columns,
  data,
  isLoading,
  meta,
  page,
  onPageChange,
  search,
  onSearchChange,
  emptyIcon,
  emptyTitle = 'Nothing here yet',
  emptyDescription,
  rowKey = '_id',
  renderActions,
}) {
  return (
    <div className="flex flex-col gap-4">
      {onSearchChange && (
        <div className="relative max-w-sm">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search…"
            aria-label="Search"
            className="h-10 w-full rounded-md border border-neutral-200 bg-neutral-0 pl-9 pr-3 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-neutral-200">
        <table className="w-full text-left text-body-sm">
          <thead className="border-b border-neutral-200 bg-neutral-100">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="whitespace-nowrap px-4 py-3 font-medium text-neutral-600">
                  {col.header}
                </th>
              ))}
              {renderActions && <th className="px-4 py-3 text-right font-medium text-neutral-600">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-neutral-200 last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <Skeleton className="h-4 w-full max-w-[160px]" />
                    </td>
                  ))}
                  {renderActions && <td className="px-4 py-3" />}
                </tr>
              ))}

            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan={columns.length + (renderActions ? 1 : 0)}>
                  <EmptyState title={emptyTitle} description={emptyDescription} icon={emptyIcon} headingLevel={3} />
                </td>
              </tr>
            )}

            {!isLoading &&
              data.map((row) => (
                <tr key={row[rowKey]} className="border-b border-neutral-200 last:border-0 hover:bg-neutral-100/60">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-neutral-900">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {renderActions && <td className="px-4 py-3 text-right">{renderActions(row)}</td>}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-caption text-neutral-600">
          <span>
            Page {meta.page} of {meta.totalPages} &middot; {meta.total} total
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              aria-label="Previous page"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= meta.totalPages}
              aria-label="Next page"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
