export function FormField({ label, error, htmlFor, children, hint }) {
  return (
    <div>
      {label && (
        <label htmlFor={htmlFor} className="mb-1.5 block text-body-sm font-medium text-neutral-900">
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1 text-caption text-neutral-600">{hint}</p>}
      {error && <p className="mt-1 text-caption text-danger-700">{error}</p>}
    </div>
  );
}
