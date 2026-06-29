import { BellRing, CheckCheck } from 'lucide-react';
import { notifications } from '../../app/data';
import { ScreenHeader } from '../../components/ScreenHeader';

export function NotificationsScreen() {
  return (
    <section className="animate-rise pb-6">
      <ScreenHeader
        eyebrow="Signals"
        title="Notifications"
        action={
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-aurora">
            <CheckCheck size={20} />
          </button>
        }
      />
      <div className="px-5 py-5">
        <div className="glass-panel rounded-[30px] p-5">
          <BellRing className="text-aurora" size={28} />
          <h2 className="mt-3 text-xl font-bold text-white">Your world is moving</h2>
          <p className="mt-2 text-sm leading-6 text-frost/60">
            Match alerts, community invites, chat updates, and future commerce activity will all land here.
          </p>
        </div>
        <div className="mt-5 space-y-3">
          {notifications.map((item) => (
            <article key={item.id} className="rounded-[26px] border border-white/10 bg-white/[0.06] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm leading-5 text-frost/60">{item.body}</p>
                </div>
                <span className="shrink-0 text-xs text-aurora">{item.time}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
