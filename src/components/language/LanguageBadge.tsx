type LanguageBadgeProps = {
  label: string;
  tone?: 'learning' | 'preferred' | 'spoken';
};

const toneStyles = {
  learning: 'border-white/10 bg-transparent text-zinc-400',
  preferred: 'border-white/20 bg-white text-black',
  spoken: 'border-white/10 bg-transparent text-zinc-400'
};

export function LanguageBadge({ label, tone = 'spoken' }: LanguageBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${toneStyles[tone]}`}>
      {label}
    </span>
  );
}
