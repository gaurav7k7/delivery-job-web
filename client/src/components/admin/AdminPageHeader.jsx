export function AdminPageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-heading text-h3 text-neutral-900">{title}</h2>
        {description && <p className="text-body-sm text-neutral-600">{description}</p>}
      </div>
      {action}
    </div>
  );
}
