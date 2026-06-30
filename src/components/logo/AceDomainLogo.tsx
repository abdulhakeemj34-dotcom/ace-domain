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
      <div className="absolute inset-x-0 top-8 mx-auto h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(232,193,96,0.18),transparent_62%)] blur-2xl" />
      <div className="relative">
        <div className="absolute inset-[-18px] rounded-full border border-gold/25 animate-orbit" />
        <div className="absolute inset-[-28px] rounded-full border border-silver/15 [transform:rotateX(62deg)_rotateZ(-18deg)]" />
        <AceDomainIcon size="xl" />
      </div>
      <div className="mt-7">
        <p className="text-[11px] font-black uppercase tracking-[0.52em] text-transparent bg-clip-text bg-gradient-to-r from-silver via-gold to-frost">
          Ace Domain
        </p>
        {showTagline && <p className="mt-2 text-xs font-semibold uppercase tracking-[0.34em] text-frost/45">Meet the World</p>}
      </div>
    </div>
  );
}
