import { AceDomainIcon } from './AceDomainIcon';

type AceDomainLogoProps = {
  compact?: boolean;
  showTagline?: boolean;
};

export function AceDomainLogo({ compact = false, showTagline = true }: AceDomainLogoProps) {
  if (compact) {
    return <AceDomainIcon size="md" withGlow={false} />;
  }

  return (
    <div className="relative flex flex-col items-center text-center" aria-label="Ace Domain logo">
      <div className="absolute inset-x-0 top-8 mx-auto h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(0,178,255,0.2),transparent_62%)] blur-2xl" />
      <div className="relative">
        <div className="absolute inset-[-18px] rounded-full border border-cyan-300/25 animate-orbit" />
        <div className="absolute inset-[-30px] rounded-full border border-blue-400/20 [transform:rotateX(62deg)_rotateZ(-18deg)]" />
        <AceDomainIcon size="xl" />
      </div>
      <div className="mt-7">
        <p className="text-[2.35rem] font-black leading-none text-white drop-shadow-[0_0_28px_rgba(0,178,255,0.24)] sm:text-5xl">
          Ace Domain
        </p>
        {showTagline && (
          <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.44em] text-transparent bg-clip-text bg-gradient-to-r from-[#0D47FF] via-[#00B2FF] to-[#00F0FF]">
            Meet the World
          </p>
        )}
      </div>
    </div>
  );
}
