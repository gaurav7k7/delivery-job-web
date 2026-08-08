import { Plus, Trash2 } from 'lucide-react';
import { FormField } from './FormField';

export function FormLinkListInput({ label, value = [], onChange, error }) {
  function updateItem(index, patch) {
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }
  function addItem() {
    onChange([...value, { label: '', url: '' }]);
  }
  function removeItem(index) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <FormField label={label} error={error}>
      <div className="flex flex-col gap-2">
        {value.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              value={item.label}
              onChange={(e) => updateItem(index, { label: e.target.value })}
              placeholder="Label"
              className="h-9 flex-1 rounded-md border border-neutral-200 bg-neutral-0 px-2.5 text-body-sm text-neutral-900 outline-none focus:border-primary-500"
            />
            <input
              value={item.url}
              onChange={(e) => updateItem(index, { url: e.target.value })}
              placeholder="URL"
              className="h-9 flex-1 rounded-md border border-neutral-200 bg-neutral-0 px-2.5 text-body-sm text-neutral-900 outline-none focus:border-primary-500"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              aria-label="Remove link"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-danger-700 hover:bg-danger-500/10"
            >
              <Trash2 size={14} aria-hidden="true" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="flex w-fit items-center gap-1.5 rounded-md border border-dashed border-neutral-200 px-3 py-1.5 text-caption font-medium text-neutral-600 hover:border-primary-500 hover:text-primary-500"
        >
          <Plus size={14} aria-hidden="true" />
          Add link
        </button>
      </div>
    </FormField>
  );
}
