import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/admin/Sidebar';
import { Topbar } from '../components/admin/Topbar';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { cn } from '../lib/cn';

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-100">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className={cn('flex min-h-screen flex-col transition-[padding] duration-200 lg:pl-64', collapsed && 'lg:pl-20')}>
        <Topbar onOpenMobileSidebar={() => setMobileOpen(true)} />
        <ErrorBoundary>
          <main className="flex-1 p-4 sm:p-6">
            <Outlet />
          </main>
        </ErrorBoundary>
      </div>
    </div>
  );
}
