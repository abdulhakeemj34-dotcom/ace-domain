import { ArrowLeft, BellPlus, CalendarDays, Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CountryBadge } from '../../components/global/CountryBadge';
import { WorldClockLabel } from '../../components/global/WorldClockLabel';
import { globalEvents } from '../../data/mockGlobalData';
import type { GlobalEvent } from '../../types/global';

type CalendarScreenProps = {
  onBack: () => void;
};

type EventState = {
  going: boolean;
  interested: boolean;
  reminder: boolean;
};

const filters: Array<GlobalEvent['category'] | 'All'> = ['All', 'Gaming', 'Campus', 'Culture', 'Community', 'Birthday', 'Holiday'];

function countryCode(country: string) {
  const codeMap: Record<string, string> = {
    France: 'FR',
    Global: 'AD',
    Japan: 'JP',
    Nigeria: 'NG',
    'United States': 'US'
  };

  return codeMap[country] ?? country.slice(0, 2).toUpperCase();
}

export function CalendarScreen({ onBack }: CalendarScreenProps) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('All');
  const [eventStates, setEventStates] = useState<Record<string, EventState>>({});

  const visibleEvents = useMemo(() => {
    return activeFilter === 'All' ? globalEvents : globalEvents.filter((event) => event.category === activeFilter);
  }, [activeFilter]);

  const updateEvent = (eventId: string, updater: (current: EventState) => EventState) => {
    setEventStates((current) => ({
      ...current,
      [eventId]: updater(current[eventId] ?? { going: false, interested: false, reminder: false })
    }));
  };

  return (
    <section className="animate-rise pb-8">
      <header className="px-5 pb-4 pt-8">
        <button type="button" onClick={onBack} className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white" aria-label="Back to global discovery">
          <ArrowLeft size={20} />
        </button>
        <div className="border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-white text-black">
              <CalendarDays size={23} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-zinc-500">Global calendar</p>
              <h1 className="text-3xl font-black text-white">Events</h1>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-frost/65">
            Events for world holidays, gaming tournaments, campus rooms, meetups, and birthdays. Calendar sync and push reminders are prepared for a later mobile layer.
          </p>
        </div>
      </header>

      <div className="px-5">
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {filters.map((filter) => {
            const active = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${active ? 'bg-white text-black' : 'border border-white/10 text-zinc-500'}`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid gap-3">
          {visibleEvents.map((event) => {
            const state = eventStates[event.id] ?? { going: false, interested: false, reminder: false };
            return (
              <article key={event.id} className="rounded-2xl border border-white/10 bg-black p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                      {event.category}
                    </span>
                    <h2 className="mt-3 text-lg font-bold text-white">{event.title}</h2>
                    <p className="mt-1 text-sm text-frost/50">{event.date} / {event.time} / {event.timeZone}</p>
                  </div>
                  <CountryBadge code={countryCode(event.country)} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-frost/65">{event.region}</span>
                  <WorldClockLabel timeZone={event.timeZone} />
                </div>
                <div className="mt-4 grid grid-cols-1 gap-2 min-[380px]:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => updateEvent(event.id, (current) => ({ ...current, interested: !current.interested }))}
                    className={`rounded-full px-3 py-3 text-xs font-bold ${state.interested ? 'bg-white text-black' : 'border border-white/10 text-zinc-500'}`}
                    aria-label={`${state.interested ? 'Remove interest in' : 'Mark interested in'} ${event.title}`}
                  >
                    Interested
                  </button>
                  <button
                    type="button"
                    onClick={() => updateEvent(event.id, (current) => ({ ...current, going: !current.going }))}
                    className={`flex items-center justify-center gap-1 rounded-full px-3 py-3 text-xs font-bold ${state.going ? 'bg-white text-black' : 'border border-white/10 text-zinc-500'}`}
                    aria-label={`${state.going ? 'Stop going to' : 'Mark going to'} ${event.title}`}
                  >
                    {state.going && <Check size={13} />}
                    Going
                  </button>
                  <button
                    type="button"
                    onClick={() => updateEvent(event.id, (current) => ({ ...current, reminder: !current.reminder }))}
                    className={`flex items-center justify-center gap-1 rounded-full px-3 py-3 text-xs font-bold ${state.reminder ? 'bg-white text-black' : 'border border-white/10 text-zinc-500'}`}
                    aria-label={`${state.reminder ? 'Remove reminder for' : 'Add reminder for'} ${event.title}`}
                  >
                    <BellPlus size={13} />
                    Reminder
                  </button>
                </div>
              </article>
            );
          })}
          {visibleEvents.length === 0 && (
            <p className="rounded-2xl border border-white/10 p-4 text-sm text-zinc-500">
              No local events in this category yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
