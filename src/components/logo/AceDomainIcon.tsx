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
  const markId = `ace-domain-mark-${gradientId}`;
  const shineId = `ace-domain-shine-${gradientId}`;
  const nodeId = `ace-domain-node-${gradientId}`;

  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden border border-white/15 bg-gradient-to-br from-[#071126] via-[#071a3d] to-[#020712] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_18px_70px_rgba(0,36,120,0.34)] ${sizeClasses[size]} ${className}`}
      aria-label="Ace Domain app icon"
    >
      {withGlow && <div className="absolute inset-[-38%] bg-[radial-gradient(circle,rgba(0,240,255,0.22),transparent_56%)] animate-luxPulse" />}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(0,178,255,0.26),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.12),transparent_30%,rgba(13,71,255,0.16)_76%)]" />
      <div className="absolute inset-x-3 bottom-2 h-px bg-gradient-to-r from-transparent via-cyan-300/55 to-transparent" />
      <svg className="relative h-[72%] w-[82%]" viewBox="0 0 128 78" role="img" aria-hidden="true">
        <defs>
          <linearGradient id={markId} x1="7" x2="119" y1="16" y2="63" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0D47FF" />
            <stop offset="0.48" stopColor="#008BFF" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient id={shineId} x1="18" x2="105" y1="9" y2="68" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" stopOpacity="0.86" />
            <stop offset="0.42" stopColor="#BFEAFF" stopOpacity="0.22" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={nodeId} x1="24" x2="48" y1="56" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00F0FF" />
            <stop offset="1" stopColor="#70F8FF" />
          </linearGradient>
        </defs>

        <path
          d="M6 66 31 13c1.8-3.8 4.4-5.7 8-5.7h10.8L79 66H61.7l-5.5-12.1H31.4L25.9 66H6Zm31.4-25.8h12.8L43.8 26l-6.4 14.2Z"
          fill={`url(#${markId})`}
        />
        <path
          d="M65.4 7.3h27.2c18 0 31 12 31 29.4 0 17.1-13 29.3-31 29.3H56.2l9.2-14.2h26.2c9 0 15.2-6 15.2-15.1 0-9.2-6.2-15.1-15.2-15.1H74.5l-9.1-14.3Z"
          fill={`url(#${markId})`}
        />
        <path
          d="M11 63.8 34.6 13.6c1.2-2.6 2.7-3.8 4.9-3.8h9.1M67.5 10.2h24.9c16.6 0 28.3 10.7 28.3 26.5"
          fill="none"
          stroke={`url(#${shineId})`}
          strokeLinecap="round"
          strokeWidth="2.6"
          opacity="0.8"
        />
        <path d="M29.6 58.4 43.7 38" stroke={`url(#${nodeId})`} strokeLinecap="round" strokeWidth="5" />
        <circle cx="29.6" cy="58.4" r="6.2" fill={`url(#${nodeId})`} />
        <circle cx="43.7" cy="38" r="7" fill={`url(#${nodeId})`} />
        <circle cx="93.5" cy="58.7" r="6.5" fill="#0D47FF" />
        <circle cx="93.5" cy="58.7" r="3.2" fill="#00B2FF" opacity="0.85" />
      </svg>
    </div>
  );
}
