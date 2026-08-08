import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '../../api/notifications.api';
import { useClickOutside } from '../../hooks/useClickOutside';
import { formatRelativeTime } from '../../lib/format';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { cn } from '../../lib/cn';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { data: notifications = [], isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  useClickOutside(ref, () => setOpen(false), open);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  function handleSelect(notification) {
    if (!notification.isRead) markRead.mutate(notification._id);
    setOpen(false);
    navigate(notification.link);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        className="relative flex h-11 w-11 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100"
      >
        <Bell size={20} aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-700 px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="glass-surface absolute right-0 z-50 mt-2 w-80 rounded-lg shadow-[var(--shadow-elevation-3)]"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
              <h3 className="font-heading text-body-sm font-semibold text-neutral-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllRead.mutate()}
                  className="flex items-center gap-1 text-caption font-medium text-primary-500 hover:underline"
                >
                  <CheckCheck size={14} aria-hidden="true" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {isLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2 border-b border-neutral-200 px-4 py-3">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}

              {!isLoading && notifications.length === 0 && (
                <EmptyState icon={Bell} title="No notifications" description="You're all caught up." className="py-10" />
              )}

              {!isLoading &&
                notifications.map((notification) => (
                  <button
                    key={notification._id}
                    type="button"
                    onClick={() => handleSelect(notification)}
                    className={cn(
                      'flex w-full flex-col gap-1 border-b border-neutral-200 px-4 py-3 text-left hover:bg-neutral-100',
                      !notification.isRead && 'bg-primary-50/50'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {!notification.isRead && <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />}
                      <p className="text-body-sm font-medium text-neutral-900">{notification.title}</p>
                    </div>
                    <p className="text-caption text-neutral-600">{notification.message}</p>
                    <p className="text-caption text-neutral-600">{formatRelativeTime(notification.createdAt)}</p>
                  </button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
