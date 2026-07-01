import type { CultureFact } from '../../types/global';

type CultureFactCardProps = {
  fact: CultureFact;
};

export function CultureFactCard({ fact }: CultureFactCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-black p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
          {fact.category}
        </span>
      </div>
      <h3 className="mt-4 font-bold text-white">{fact.country}</h3>
      <p className="mt-2 text-sm leading-6 text-frost/65">{fact.text}</p>
      <p className="mt-3 rounded-2xl border border-white/10 px-3 py-2 text-xs leading-5 text-zinc-500">{fact.prompt}</p>
    </article>
  );
}
