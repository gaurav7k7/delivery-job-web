import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { FormField } from './FormField';

export function FormArrayInput({ label, value = [], onChange, placeholder = 'Add item and press Enter', error }) {
  const [draft, setDraft] = useState('');

  function addItem() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...value, trimmed]);
    setDraft('');
  }

  function removeItem(index) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <FormField label={label} error={error}>
      <div className="flex flex-wrap gap-2 rounded-md border border-neutral-200 bg-neutral-0 p-2">
        {value.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-caption text-neutral-900"
          >
            {item}
            <button type="button" onClick={() => removeItem(index)} aria-label={`Remove ${item}`}>
              <X size={12} aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addItem();
            }
          }}
          placeholder={placeholder}
          className="min-w-[140px] flex-1 border-none bg-transparent px-1 py-1 text-body-sm text-neutral-900 outline-none"
        />
        <button
          type="button"
          onClick={addItem}
          className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100"
          aria-label="Add item"
        >
          <Plus size={14} aria-hidden="true" />
        </button>
      </div>
    </FormField>
  );
}
