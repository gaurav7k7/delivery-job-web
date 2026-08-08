import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

const variants = {
  primary: 'bg-primary-500 text-[var(--color-on-primary)] shadow-[var(--shadow-glow-primary)] hover:bg-primary-700',
  secondary: 'border border-neutral-200 text-neutral-900 hover:border-primary-500 hover:text-primary-500',
  ghost: 'text-neutral-900 hover:bg-neutral-100',
};

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-base',
  lg: 'h-12 px-8 text-lg',
};

export const Button = forwardRef(function Button(
  { to, href, variant = 'primary', size = 'md', className, children, ...props },
  ref
) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className
  );

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a ref={ref} href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <motion.button ref={ref} whileTap={{ scale: 0.98 }} className={classes} {...props}>
      {children}
    </motion.button>
  );
});
