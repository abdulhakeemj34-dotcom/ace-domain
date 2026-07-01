type CountryBadgeProps = {
  code: string;
  label?: string;
};

export function CountryBadge({ code, label }: CountryBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-transparent px-3 py-1 text-xs font-bold text-zinc-400">
      <span className="grid h-5 min-w-8 place-items-center rounded-full bg-white px-2 text-[10px] font-black text-black">
        {code}
      </span>
      {label && <span className="truncate">{label}</span>}
    </span>
  );
}
