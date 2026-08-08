import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { ThemeToggle } from '../layout/ThemeToggle';
import { NotificationBell } from './NotificationBell';
import { ProfileMenu } from './ProfileMenu';
import { adminNav } from './adminNav.config';

function resolvePageTitle(pathname) {
  for (const item of adminNav) {
    if (item.to && pathname === item.to) return item.label;
    if (item.children) {
      const match = item.children.find((child) => pathname.startsWith(child.to));
      if (match) return match.label;
    }
  }
  if (pathname === '/admin/profile') return 'Profile';
  if (pathname === '/admin/change-password') return 'Change Password';
  return 'Dashboard';
}

export function Topbar({ onOpenMobileSidebar }) {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-neutral-200 bg-neutral-0/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open sidebar"
          className="flex h-11 w-11 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100 lg:hidden"
        >
          <Menu size={20} aria-hidden="true" />
        </button>
        <h1 className="font-heading text-h4 font-semibold text-neutral-900">{resolvePageTitle(pathname)}</h1>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <ThemeToggle />
        <NotificationBell />
        <div className="mx-1 h-6 w-px bg-neutral-200" />
        <ProfileMenu />
      </div>
    </header>
  );
}
