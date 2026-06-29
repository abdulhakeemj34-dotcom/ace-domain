import { AceDomainLogo } from './AceDomainLogo';

type StartupSplashProps = {
  isVisible: boolean;
};

export function StartupSplash({ isVisible }: StartupSplashProps) {
  return (
    <div
      className={`fixed inset-0 z-50 grid place-items-center bg-void transition duration-700 ${
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!isVisible}
    >
      <div className="absolute inset-0 orbital-grid" />
      <div className="absolute h-80 w-80 rounded-full bg-signal/20 blur-3xl animate-pulseGlow" />
      <div className="relative flex flex-col items-center">
        <AceDomainLogo />
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.45em] text-aurora/80">Ace Domain</p>
        <p className="mt-2 text-sm text-frost/55">Meet the World</p>
      </div>
    </div>
  );
}
