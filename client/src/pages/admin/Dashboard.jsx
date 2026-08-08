import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { UserPlus, MessageSquareWarning, Star, FileText, Briefcase } from 'lucide-react';
import { Seo } from '../../components/ui/Seo';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { StatCard } from '../../components/admin/StatCard';
import { ActivityFeed } from '../../components/admin/ActivityFeed';
import { useDashboardStats, useActivityLog } from '../../api/dashboard.api';
import { useAuthStore } from '../../store/authStore';

const PIE_COLORS = ['#4F46E5', '#7C6FF0', '#F97316', '#FDBA74', '#16A34A', '#57596B'];

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const { data: stats, isLoading: statsQueryLoading } = useDashboardStats();
  const { data: logs, isLoading: logsLoading } = useActivityLog();

  // Treat a still-missing response (e.g. a failed request) the same as
  // "loading" — the skeletons below assume `stats` is always defined once
  // loading is false, and a network error must never crash the dashboard.
  const statsLoading = statsQueryLoading || !stats;

  return (
    <>
      <Seo title="Dashboard" noIndex />
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-heading text-h3 text-neutral-900">Welcome back, {user?.name?.split(' ')[0]}</h2>
          <p className="text-body-sm text-neutral-600">Here&rsquo;s what&rsquo;s happening across Zerivon today.</p>
        </div>

        {statsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard icon={UserPlus} label="New Applications" value={stats.riderApplications.new} tone="primary" trend={{ direction: 'up', label: '12% this week' }} />
            <StatCard icon={MessageSquareWarning} label="Unread Messages" value={stats.unreadMessages} tone="warning" />
            <StatCard icon={Star} label="Pending Testimonials" value={stats.pendingTestimonials} tone="accent" />
            <StatCard icon={FileText} label="Published Posts" value={stats.publishedBlogCount} tone="success" />
            <StatCard icon={Briefcase} label="Open Job Applications" value={stats.openJobApplications} tone="primary" />
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-5 lg:col-span-2">
            <h3 className="font-heading text-h4 text-neutral-900">Rider Applications — Last 7 Days</h3>
            <div className="mt-4 h-72">
              {statsLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.weeklyApplications}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-neutral-200)" />
                    <XAxis dataKey="day" stroke="var(--color-neutral-600)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--color-neutral-600)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--color-neutral-0)',
                        border: '1px solid var(--color-neutral-200)',
                        borderRadius: 8,
                        fontSize: 13,
                      }}
                    />
                    <Bar dataKey="applications" fill="var(--color-primary-500)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-heading text-h4 text-neutral-900">Applications by Platform</h3>
            <div className="mt-4 h-72">
              {statsLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.platformBreakdown}
                      dataKey="count"
                      nameKey="platform"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={2}
                      isAnimationActive={false}
                    >
                      {stats.platformBreakdown.map((entry, index) => (
                        <Cell key={entry.platform} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'var(--color-neutral-0)',
                        border: '1px solid var(--color-neutral-200)',
                        borderRadius: 8,
                        fontSize: 13,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
              {!statsLoading &&
                stats.platformBreakdown.map((entry, index) => (
                  <li key={entry.platform} className="flex items-center gap-2 text-caption text-neutral-600">
                    <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[index % PIE_COLORS.length] }} />
                    {entry.platform}
                  </li>
                ))}
            </ul>
          </Card>
        </div>

        <ActivityFeed entries={logs ?? []} isLoading={logsLoading} />
      </div>
    </>
  );
}
