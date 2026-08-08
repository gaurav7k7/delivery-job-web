import { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, KeyRound, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from '../../api/auth.api';
import { useClickOutside } from '../../hooks/useClickOutside';

function getInitials(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  useClickOutside(ref, () => setOpen(false), open);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 hover:bg-neutral-100"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-body-sm font-semibold text-[var(--color-on-primary)]">
          {getInitials(user.name)}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-body-sm font-medium text-neutral-900">{user.name}</span>
          <span className="block text-caption text-neutral-600">{user.role?.name}</span>
        </span>
        <ChevronDown size={16} className="hidden text-neutral-600 sm:block" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-neutral-200 bg-neutral-0 p-1.5 shadow-[var(--shadow-elevation-3)]"
          >
            <NavLink
              to="/admin/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-body-sm text-neutral-900 hover:bg-neutral-100"
            >
              <User size={16} aria-hidden="true" />
              Profile
            </NavLink>
            <NavLink
              to="/admin/change-password"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-body-sm text-neutral-900 hover:bg-neutral-100"
            >
              <KeyRound size={16} aria-hidden="true" />
              Change Password
            </NavLink>
            <div className="my-1 border-t border-neutral-200" />
            <button
              type="button"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-body-sm text-danger-700 hover:bg-danger-500/10 disabled:opacity-50"
            >
              <LogOut size={16} aria-hidden="true" />
              {logout.isPending ? 'Logging out…' : 'Log out'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
