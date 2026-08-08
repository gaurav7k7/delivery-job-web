import { motion } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export function SectionHeading({ eyebrow, title, description, align = 'center' }) {
  const reveal = useScrollReveal();
  const isCenter = align === 'center';

  return (
    <motion.div {...reveal} className={`flex flex-col gap-3 ${isCenter ? 'items-center text-center' : 'items-start text-left'}`}>
      {eyebrow && (
        <span className="text-caption font-semibold uppercase tracking-wide text-accent-700">{eyebrow}</span>
      )}
      <h2 className="font-heading text-h2 text-neutral-900">{title}</h2>
      {description && <p className={`text-body-lg text-neutral-600 ${isCenter ? 'max-w-2xl' : 'max-w-xl'}`}>{description}</p>}
    </motion.div>
  );
}
