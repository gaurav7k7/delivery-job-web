import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export function CTASection({ eyebrow, title, description, primaryLabel, primaryTo, secondaryLabel, secondaryTo }) {
  const reveal = useScrollReveal();

  return (
    <section className="py-20">
      <Container>
        <motion.div
          {...reveal}
          className="gradient-brand flex flex-col items-center gap-6 rounded-2xl px-6 py-16 text-center text-[var(--color-on-primary)] sm:px-16"
        >
          {eyebrow && <span className="text-caption font-semibold uppercase tracking-wide opacity-90">{eyebrow}</span>}
          <h2 className="font-heading text-h1">{title}</h2>
          {description && <p className="max-w-xl text-body-lg opacity-90">{description}</p>}
          <div className="flex flex-wrap justify-center gap-4">
            <Button to={primaryTo} size="lg" className="bg-neutral-0 text-primary-700 shadow-none hover:bg-neutral-100">
              {primaryLabel}
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
            {secondaryLabel && (
              <Button to={secondaryTo} variant="secondary" size="lg" className="border-[var(--color-on-primary)] text-[var(--color-on-primary)] hover:border-neutral-0">
                {secondaryLabel}
              </Button>
            )}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
