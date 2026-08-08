import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

export function Card({ className, children, hoverLift = true, ...props }) {
  return (
    <motion.div
      whileHover={hoverLift ? { scale: 1.02, boxShadow: 'var(--shadow-elevation-2)' } : undefined}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={cn('rounded-lg border border-neutral-200 bg-neutral-0 shadow-[var(--shadow-elevation-1)]', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
