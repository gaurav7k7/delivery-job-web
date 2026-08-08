import { cn } from '../../../lib/cn';

export function FormSwitch({ label, checked, onChange, hint }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-body-sm font-medium text-neutral-900">{label}</p>
        {hint && <p className="text-caption text-neutral-600">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', checked ? 'bg-primary-500' : 'bg-neutral-200')}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-neutral-0 shadow transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  );
}
