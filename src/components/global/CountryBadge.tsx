type CountryBadgeProps = {
  code: string;
  label?: string;
};

export function CountryBadge({ code, label }: CountryBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs font-bold text-frost/75">
      <span className="grid h-5 min-w-8 place-items-center rounded-full bg-gradient-to-br from-aurora/80 via-white to-signal/80 px-2 text-[10px] font-black text-void">
        {code}
      </span>
      {label && <span className="truncate">{label}</span>}
    </span>
  );
}
