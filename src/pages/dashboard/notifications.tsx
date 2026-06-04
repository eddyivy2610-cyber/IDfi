import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/src/pages/dashboard';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/state/store';
import { Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'error' | 'success' | 'info';
  link: string;
  createdAt: string;
  read: boolean;
}

const NotificationsPage = () => {
  const { user, profile, loading } = useSelector((state: RootState) => state.auth);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      try {
        const res = await fetch('/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data?.notifications) {
          setNotifications(data.notifications);
        }
      } catch (err) {
        console.error('Failed to load notifications', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) fetchNotifications();
  }, [user]);

  const getIcon = (type: string) => {
    switch(type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch(type) {
      case 'warning': return 'bg-amber-50 border-amber-100';
      case 'error': return 'bg-red-50 border-red-100';
      case 'success': return 'bg-green-50 border-green-100';
      default: return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <DashboardLayout loading={loading} profile={profile} user={user}>
      <div className="max-w-4xl mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#0052FF]/10 flex items-center justify-center text-[#0052FF]">
            <Bell className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-[#111827] font-sora">Notifications</h1>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl w-full"></div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white border border-[#EAECF0] rounded-xl p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 text-gray-400">
              <Bell className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-[#111827] mb-1">All Caught Up!</h3>
            <p className="text-sm text-[#6E7C87]">You have no new notifications to review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div key={notif.id} className={`p-6 rounded-xl border flex gap-4 items-start transition-all hover:shadow-md ${getBgColor(notif.type)}`}>
                <div className="mt-1 flex-shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-[#111827] mb-1">{notif.title}</h3>
                  <p className="text-sm text-[#6E7C87] mb-4">{notif.message}</p>
                  <Link href={notif.link} className="text-sm font-semibold text-[#0052FF] hover:text-[#0040D0] transition-colors">
                    Take Action &rarr;
                  </Link>
                </div>
                <div className="text-xs text-[#9BA7B0]">
                  {new Date(notif.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
