import { BellRing, CheckCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { notifications } from '../../app/data';
import { ScreenHeader } from '../../components/ScreenHeader';
import type { NotificationItem } from '../../app/types';

type NotificationFilter = 'all' | 'unread' | NotificationItem['category'];

const filters: Array<{ label: string; value: NotificationFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Social', value: 'social' },
  { label: 'Messages', value: 'message' },
  { label: 'Matches', value: 'match' },
  { label: 'Communities', value: 'community' }
];

export function NotificationsScreen() {
  const [items, setItems] = useState(notifications);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');

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

  return (
    <section className="animate-rise pb-6">
      <ScreenHeader
        eyebrow="Signals"
        title="Notifications"
        action={
          <button
            type="button"
            onClick={() => setItems((current) => current.map((item) => ({ ...item, unread: false })))}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-aurora"
            aria-label="Mark all notifications as read"
          >
            <CheckCheck size={20} />
          </button>
        }
      />
      <div className="px-5 py-5">
        <div className="glass-panel rounded-[30px] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <BellRing className="text-aurora" size={28} />
              <h2 className="mt-3 text-xl font-bold text-white">Your world is moving</h2>
              <p className="mt-2 text-sm leading-6 text-frost/60">
                Match alerts, community invites, chat updates, and social signals all land here.
              </p>
            </div>
            <span className="rounded-full bg-plasma/15 px-3 py-1 text-xs font-bold text-plasma">{unreadCount} unread</span>
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {filters.map((filter) => {
            const active = activeFilter === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                  active ? 'bg-white text-void' : 'bg-white/10 text-frost/60'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 space-y-3">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                setItems((current) =>
                  current.map((notification) =>
                    notification.id === item.id ? { ...notification, unread: !notification.unread } : notification
                  )
                )
              }
              className={`w-full rounded-[26px] border p-4 text-left transition ${
                item.unread ? 'border-aurora/30 bg-aurora/[0.08]' : 'border-white/10 bg-white/[0.06]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {item.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-aurora" />}
                    <h3 className="font-bold text-white">{item.title}</h3>
                  </div>
                  <p className="mt-1 text-sm leading-5 text-frost/60">{item.body}</p>
                  <span className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-frost/45">
                    {item.category}
                  </span>
                </div>
                <span className="shrink-0 text-xs text-aurora">{item.time}</span>
              </div>
            </button>
          ))}

          {filteredItems.length === 0 && (
            <p className="rounded-[26px] border border-white/10 bg-white/[0.06] p-4 text-sm text-frost/55">
              No notifications in this state yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
