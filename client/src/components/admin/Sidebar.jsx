import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronsLeft, ChevronsRight, X } from 'lucide-react';
import { adminNav } from './adminNav.config';
import { cn } from '../../lib/cn';

function isGroupActive(group, pathname) {
  return group.children?.some((child) => pathname.startsWith(child.to)) ?? false;
}

function NavGroup({ group, collapsed, pathname, onNavigate }) {
  const [open, setOpen] = useState(() => isGroupActive(group, pathname));
  const Icon = group.icon;
  const active = isGroupActive(group, pathname);

  if (collapsed) {
    // Icon-only rail: hover reveals a flyout of children (CSS-only, no JS positioning).
    return (
      <div className="group relative">
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100 hover:text-primary-500',
            active && 'bg-primary-50 text-primary-500'
          )}
        >
          <Icon size={20} aria-hidden="true" />
        </div>
        <div className="invisible absolute top-0 left-full z-50 ml-2 w-48 rounded-lg border border-neutral-200 bg-neutral-0 p-2 opacity-0 shadow-[var(--shadow-elevation-3)] transition-opacity group-hover:visible group-hover:opacity-100">
          <p className="px-2 py-1 text-caption font-semibold uppercase tracking-wide text-neutral-600">{group.label}</p>
          {group.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'block rounded-md px-2 py-2 text-body-sm text-neutral-900 hover:bg-neutral-100',
                  isActive && 'bg-primary-50 text-primary-500'
                )
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          'flex w-full items-center justify-between rounded-md px-3 py-2.5 text-body-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
          active && 'text-primary-500'
        )}
      >
        <span className="flex items-center gap-3">
          <Icon size={20} aria-hidden="true" />
          {group.label}
        </span>
        <ChevronDown size={16} className={cn('transition-transform duration-200', open && 'rotate-180')} aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden pl-4"
          >
            <div className="flex flex-col gap-0.5 border-l border-neutral-200 py-1 pl-4">
              {group.children.map((child) => (
                <NavLink
                  key={child.to}
                  to={child.to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'rounded-md px-3 py-2 text-body-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                      isActive && 'bg-primary-50 font-medium text-primary-500'
                    )
                  }
                >
                  {child.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavLeaf({ item, collapsed, onNavigate }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-md px-3 py-2.5 text-body-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
          collapsed && 'justify-center px-0',
          isActive && 'bg-primary-50 text-primary-500'
        )
      }
    >
      <Icon size={20} aria-hidden="true" />
      {!collapsed && item.label}
    </NavLink>
  );
}

function SidebarContent({ collapsed, onToggleCollapse, onNavigate, showCollapseToggle }) {
  const { pathname } = useLocation();

  return (
    <div className="flex h-full flex-col">
      <div className={cn('flex h-16 items-center gap-2 border-b border-neutral-200 px-4', collapsed && 'justify-center px-2')}>
        <span className="font-heading text-h4 font-bold text-gradient-brand">{collapsed ? 'Z' : 'Zerivon'}</span>
        {!collapsed && <span className="text-caption font-medium text-neutral-600">Admin</span>}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Admin">
        {adminNav.map((item) =>
          item.children ? (
            <NavGroup key={item.label} group={item} collapsed={collapsed} pathname={pathname} onNavigate={onNavigate} />
          ) : (
            <NavLeaf key={item.to} item={item} collapsed={collapsed} onNavigate={onNavigate} />
          )
        )}
      </nav>

      {showCollapseToggle && (
        <div className="border-t border-neutral-200 p-3">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex w-full items-center justify-center gap-2 rounded-md py-2 text-body-sm text-neutral-600 hover:bg-neutral-100"
          >
            {collapsed ? <ChevronsRight size={18} aria-hidden="true" /> : <ChevronsLeft size={18} aria-hidden="true" />}
            {!collapsed && 'Collapse'}
          </button>
        </div>
      )}
    </div>
  );
}

export function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  return (
    <>
      {/* Desktop rail */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 hidden border-r border-neutral-200 bg-neutral-0 transition-[width] duration-200 lg:block',
          collapsed ? 'w-20' : 'w-64'
        )}
      >
        <SidebarContent collapsed={collapsed} onToggleCollapse={onToggleCollapse} showCollapseToggle />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-40 bg-neutral-900/50 lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-neutral-0 shadow-[var(--shadow-elevation-4)] lg:hidden"
            >
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close sidebar"
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100"
              >
                <X size={18} aria-hidden="true" />
              </button>
              <SidebarContent collapsed={false} onNavigate={onCloseMobile} showCollapseToggle={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
