type LanguageBadgeProps = {
  label: string;
  tone?: 'learning' | 'preferred' | 'spoken';
};

const toneStyles = {
  learning: 'border-signal/30 bg-signal/10 text-signal',
  preferred: 'border-white/20 bg-white text-void',
  spoken: 'border-aurora/30 bg-aurora/10 text-aurora'
};

export function LanguageBadge({ label, tone = 'spoken' }: LanguageBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${toneStyles[tone]}`}>
      {label}
    </span>
  );
}
