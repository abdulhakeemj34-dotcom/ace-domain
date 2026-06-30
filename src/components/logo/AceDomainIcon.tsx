import { useId } from 'react';

type AceDomainIconProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withGlow?: boolean;
};

const sizeClasses = {
  sm: 'h-10 w-10 rounded-2xl',
  md: 'h-12 w-12 rounded-[18px]',
  lg: 'h-20 w-20 rounded-[26px]',
  xl: 'h-32 w-32 rounded-[34px]'
};

export function AceDomainIcon({ className = '', size = 'md', withGlow = true }: AceDomainIconProps) {
  const gradientId = useId().replace(/:/g, '');
  const metalId = `ace-metal-${gradientId}`;
  const ringId = `ace-ring-${gradientId}`;

  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden border border-white/15 bg-gradient-to-br from-[#05070f] via-[#0a1230] to-[#02030a] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_18px_70px_rgba(0,0,0,0.45)] ${sizeClasses[size]} ${className}`}
      aria-label="Ace Domain app icon"
    >
      {withGlow && <div className="absolute inset-[-35%] bg-[radial-gradient(circle,rgba(232,193,96,0.22),transparent_55%)] animate-luxPulse" />}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_32%,rgba(123,92,255,0.12)_65%,rgba(232,193,96,0.16))]" />
      <svg className="relative h-[78%] w-[78%]" viewBox="0 0 100 100" role="img" aria-hidden="true">
        <defs>
          <linearGradient id={metalId} x1="18" x2="82" y1="10" y2="92" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF7D2" />
            <stop offset="0.28" stopColor="#D6DBE7" />
            <stop offset="0.58" stopColor="#C09135" />
            <stop offset="1" stopColor="#5E7DFF" />
          </linearGradient>
          <linearGradient id={ringId} x1="12" x2="88" y1="50" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2B54FF" stopOpacity="0.2" />
            <stop offset="0.32" stopColor="#F0C86B" />
            <stop offset="0.7" stopColor="#DCE4F7" />
            <stop offset="1" stopColor="#7B5CFF" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="51" rx="39" ry="17" fill="none" stroke={`url(#${ringId})`} strokeWidth="3.5" transform="rotate(-18 50 51)" />
        <path
          d="M51 14 77 82H64l-5-14H39l-5 14H22L48 14h3Zm-8 43h12l-6-20-6 20Z"
          fill={`url(#${metalId})`}
        />
        <path d="M36 70h28" stroke="#FFF1B8" strokeLinecap="round" strokeWidth="3.5" opacity="0.75" />
        <circle cx="18" cy="47" r="3" fill="#F0C86B" />
        <circle cx="79" cy="37" r="2.5" fill="#E8EEF9" />
      </svg>
    </div>
  );
}
