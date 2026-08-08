import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export function ConfirmDialog({ open, title, description, confirmLabel = 'Delete', onConfirm, onCancel, isLoading }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-neutral-900/40"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            role="alertdialog"
            aria-modal="true"
            aria-label={title}
            className="fixed left-1/2 top-1/2 z-[70] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg bg-neutral-0 p-6 shadow-[var(--shadow-elevation-3)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-500/10 text-danger-700">
              <AlertTriangle size={22} aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-heading text-h4 text-neutral-900">{title}</h3>
            {description && <p className="mt-1.5 text-body-sm text-neutral-600">{description}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button size="sm" onClick={onConfirm} disabled={isLoading} className="bg-danger-500 shadow-none hover:bg-danger-700">
                {isLoading ? 'Deleting…' : confirmLabel}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
