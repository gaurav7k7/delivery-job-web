import { forwardRef } from 'react';
import { cn } from '../../../lib/cn';
import { FormField } from './FormField';

export const FormTextarea = forwardRef(function FormTextarea(
  { label, error, hint, className, rows = 4, ...props },
  ref
) {
  return (
    <FormField label={label} error={error} htmlFor={props.id} hint={hint}>
      <textarea
        ref={ref}
        rows={rows}
        {...props}
        className={cn(
          'w-full resize-y rounded-md border border-neutral-200 bg-neutral-0 px-3 py-2.5 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
          error && 'border-danger-500',
          className
        )}
        aria-invalid={Boolean(error)}
      />
    </FormField>
  );
});
