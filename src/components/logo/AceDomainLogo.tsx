type AceDomainLogoProps = {
  compact?: boolean;
};

export function AceDomainLogo({ compact = false }: AceDomainLogoProps) {
  return (
    <div className={`relative grid place-items-center ${compact ? 'h-12 w-12' : 'h-48 w-48'}`} aria-label="Ace Domain logo">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-200 via-signal to-aurora opacity-20 blur-2xl animate-pulseGlow" />
      <div className="absolute inset-[8%] rounded-full border border-silver/40 animate-orbit" />
      <div className="absolute inset-[18%] rounded-full border border-aurora/30" />
      <div className="absolute left-[18%] top-[30%] h-2 w-2 rounded-full bg-aurora shadow-glow animate-nodeSpark" />
      <div className="absolute right-[20%] top-[45%] h-2 w-2 rounded-full bg-plasma shadow-glow animate-nodeSpark [animation-delay:700ms]" />
      <div className="absolute bottom-[25%] left-[48%] h-2 w-2 rounded-full bg-silver shadow-glow animate-nodeSpark [animation-delay:1200ms]" />
      <div className="relative grid h-[76%] w-[76%] place-items-center rounded-[30%] border border-white/15 bg-gradient-to-br from-[#12182f] via-[#0a0d1d] to-[#050713] shadow-glow">
        <span className={`${compact ? 'text-2xl' : 'text-7xl'} font-black tracking-[-0.08em] text-transparent bg-clip-text bg-gradient-to-br from-white via-silver to-aurora`}>
          A
        </span>
        {!compact && <span className="absolute bottom-7 text-[10px] font-bold uppercase tracking-[0.45em] text-aurora/80">Domain</span>}
      </div>
    </div>
  );
}
