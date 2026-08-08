import { forwardRef } from 'react';
import { cn } from '../../../lib/cn';
import { FormField } from './FormField';

export const FormInput = forwardRef(function FormInput({ label, error, hint, className, ...props }, ref) {
  return (
    <FormField label={label} error={error} htmlFor={props.id} hint={hint}>
      <input
        ref={ref}
        {...props}
        className={cn(
          'h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 text-body-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
          error && 'border-danger-500',
          className
        )}
        aria-invalid={Boolean(error)}
      />
    </FormField>
  );
});
