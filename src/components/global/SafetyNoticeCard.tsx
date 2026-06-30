import { ShieldCheck } from 'lucide-react';

type SafetyNoticeCardProps = {
  body: string;
  title?: string;
};

export function SafetyNoticeCard({ body, title = 'Global safety reminder' }: SafetyNoticeCardProps) {
  return (
    <aside className="rounded-[26px] border border-aurora/20 bg-aurora/[0.07] p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-aurora/15 text-aurora">
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
