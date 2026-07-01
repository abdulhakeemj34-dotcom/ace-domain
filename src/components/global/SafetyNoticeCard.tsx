import { ShieldCheck } from 'lucide-react';

type SafetyNoticeCardProps = {
  body: string;
  title?: string;
};

export function SafetyNoticeCard({ body, title = 'Global safety reminder' }: SafetyNoticeCardProps) {
  return (
    <aside className="rounded-2xl border border-white/10 bg-black p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 text-zinc-400">
          <ShieldCheck size={19} />
        </div>
        <div>
          <h3 className="font-bold text-white">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-frost/65">{body}</p>
        </div>
      </div>
    </aside>
  );
}
