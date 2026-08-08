import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Button } from '../ui/Button';

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

export function MobileMenu({ items, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="glass-surface fixed inset-x-0 top-16 bottom-0 z-30 overflow-y-auto xl:hidden"
    >
      <motion.nav variants={container} initial="hidden" animate="visible" className="flex flex-col gap-1 p-6" aria-label="Mobile">
        {items.map((navItem) => (
          <motion.div key={navItem._id} variants={item}>
            <NavLink
              to={navItem.url}
              onClick={onClose}
              className="block rounded-md px-4 py-3 text-lg font-medium text-neutral-900 hover:bg-neutral-100"
            >
              {navItem.label}
            </NavLink>
          </motion.div>
        ))}
        <motion.div variants={item} className="mt-4">
          <Button to="/apply" className="w-full" onClick={onClose}>
            Apply Now
          </Button>
        </motion.div>
      </motion.nav>
    </motion.div>
  );
}
