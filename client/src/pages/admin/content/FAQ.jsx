import { z } from 'zod';
import { HelpCircle } from 'lucide-react';
import { SimpleResourceCrud } from '../../../components/admin/SimpleResourceCrud';
import { FormInput } from '../../../components/admin/form/FormInput';
import { FormTextarea } from '../../../components/admin/form/FormTextarea';
import { faqApi } from '../../../api/faq.api';

const schema = z.object({
  question: z.string().trim().min(2, 'Question is required'),
  answer: z.string().trim().min(2, 'Answer is required'),
  category: z.string().trim().optional(),
  page: z.string().trim().optional(),
  order: z.coerce.number().optional(),
});

const defaultValues = { question: '', answer: '', category: 'general', page: 'general', order: 0 };

export default function FAQ() {
  return (
    <SimpleResourceCrud
      api={faqApi}
      permission="faq:manage"
      seoTitle="FAQ"
      title="FAQ"
      description="Frequently asked questions shown on the homepage and elsewhere."
      itemLabel="FAQ"
      itemNameField="question"
      emptyIcon={HelpCircle}
      schema={schema}
      defaultValues={defaultValues}
      columns={[
        { key: 'question', header: 'Question', render: (row) => <span className="line-clamp-1 max-w-md">{row.question}</span> },
        { key: 'page', header: 'Page' },
        { key: 'category', header: 'Category' },
      ]}
      renderFields={({ register, errors }) => (
        <>
          <FormInput label="Question" {...register('question')} error={errors.question?.message} />
          <FormTextarea label="Answer" {...register('answer')} error={errors.answer?.message} />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Page" {...register('page')} />
            <FormInput label="Category" {...register('category')} />
          </div>
          <FormInput label="Order" type="number" {...register('order')} />
        </>
      )}
    />
  );
}
