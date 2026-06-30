import { Clock3 } from 'lucide-react';

type WorldClockLabelProps = {
  compact?: boolean;
  timeZone: string;
};

function localParts(timeZone: string) {
  try {
    const now = new Date();
    const time = new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      timeZone
    }).format(now);
    const hourLabel = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: false,
      timeZone
    }).format(now);
    const hour = Number(hourLabel);
    const likelyActive = hour >= 7 && hour < 23;

    return {
      status: likelyActive ? 'Likely active' : 'May be asleep',
      time
    };
  } catch {
    return {
      status: 'Local time ready',
      time: 'Time zone set'
    };
  }
}

export function WorldClockLabel({ compact = false, timeZone }: WorldClockLabelProps) {
  const parts = localParts(timeZone);

  return (
    <span className={`inline-flex min-w-0 items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-frost/70 ${compact ? 'max-w-full' : ''}`}>
      <Clock3 size={13} className="shrink-0 text-aurora" />
      <span className="min-w-0 truncate">{parts.time} / {parts.status}</span>
    </span>
  );
}
