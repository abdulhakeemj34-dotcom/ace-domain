import { CheckCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { notifications } from '../../app/data';
import type { NotificationItem } from '../../app/types';
import { ScreenHeader } from '../../components/ScreenHeader';
import { getNotifications, markAllNotificationsRead, setNotificationRead } from '../../services/notificationService';

type NotificationFilter = 'all' | 'unread' | NotificationItem['category'];

const filters: Array<{ label: string; value: NotificationFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Social', value: 'social' },
  { label: 'Chats', value: 'message' },
  { label: 'Matches', value: 'match' },
  { label: 'Groups', value: 'community' }
];

const categoryLabels: Record<NotificationItem['category'], string> = {
  community: 'Group',
  match: 'Match',
  message: 'Chat',
  social: 'Social'
};

export function NotificationsScreen() {
  const [items, setItems] = useState(notifications);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');
  const [syncStatus, setSyncStatus] = useState('');

  useEffect(() => {
    let isMounted = true;

    getNotifications().then((result) => {
      if (!isMounted) {
        return;
      }

      setItems(result.data);

      if (result.error) {
        setSyncStatus('Showing local notifications while live updates connect.');
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') {
      return items;
    }

    if (activeFilter === 'unread') {
      return items.filter((item) => item.unread);
    }

    return items.filter((item) => item.category === activeFilter);
  }, [activeFilter, items]);

  const unreadCount = items.filter((item) => item.unread).length;

  const markAllRead = () => {
    setItems((current) => current.map((item) => ({ ...item, unread: false })));
    markAllNotificationsRead().then((result) => {
      if (result.usingFallback) {
        setSyncStatus('Marked locally. Live sync will follow when available.');
      }
    });
  };

  const toggleRead = (item: NotificationItem) => {
    const nextUnread = !item.unread;
    setItems((current) =>
      current.map((notification) =>
        notification.id === item.id ? { ...notification, unread: nextUnread } : notification
      )
    );
    setNotificationRead(item.id, !nextUnread).then((result) => {
      if (result.usingFallback) {
        setSyncStatus('Notification state saved locally.');
      }
    });
  };

  return (
    <section className="animate-rise pb-6">
      <ScreenHeader
        eyebrow={`${unreadCount} unread`}
        title="Notifications"
        action={
          <button
            type="button"
            onClick={markAllRead}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white"
            aria-label="Mark all notifications as read"
          >
            <CheckCheck size={20} />
          </button>
        }
      />

      {syncStatus && <p className="mx-4 mt-3 rounded-2xl bg-white/[0.05] px-3 py-2 text-xs leading-5 text-frost/55">{syncStatus}</p>}

      <div className="mt-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
        {filters.map((filter) => {
          const active = activeFilter === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                active ? 'bg-white text-black' : 'border border-white/10 text-zinc-500'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 divide-y divide-white/10">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => toggleRead(item)}
            className="flex w-full min-w-0 items-start gap-3 px-4 py-3.5 text-left transition hover:bg-white/[0.04]"
          >
            <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.unread ? 'bg-[#1d9bf0]' : 'bg-white/20'}`} />
            <span className="min-w-0 flex-1">
              <span className="flex min-w-0 items-center gap-2">
                <span className="truncate font-bold text-white">{item.title}</span>
                <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">
                  {categoryLabels[item.category]}
                </span>
              </span>
              <span className="mt-1 line-clamp-2 text-sm leading-5 text-frost/55">{item.body}</span>
            </span>
            <span className="shrink-0 text-xs text-frost/45">{item.time}</span>
          </button>
        ))}

        {filteredItems.length === 0 && (
          <div className="px-4 py-6 text-center">
            <h2 className="font-bold text-white">Nothing here yet</h2>
            <p className="mt-2 text-sm leading-6 text-frost/55">Notifications in this category will appear here.</p>
          </div>
        )}
      </div>
    </section>
  );
}
