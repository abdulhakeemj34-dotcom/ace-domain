import { AceDomainIcon } from './AceDomainIcon';

type StartupSplashProps = {
  isVisible: boolean;
};

const particles = [
  { left: '12%', top: '18%', delay: '0ms', size: '2px' },
  { left: '78%', top: '16%', delay: '300ms', size: '3px' },
  { left: '22%', top: '70%', delay: '650ms', size: '2px' },
  { left: '86%', top: '64%', delay: '900ms', size: '2px' },
  { left: '50%', top: '12%', delay: '1200ms', size: '2px' },
  { left: '67%', top: '80%', delay: '1500ms', size: '3px' }
];

export function StartupSplash({ isVisible }: StartupSplashProps) {
  return (
    <div
      className={`fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[#02030a] transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!isVisible}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(18,33,88,0.7),transparent_42%),radial-gradient(circle_at_50%_82%,rgba(232,193,96,0.14),transparent_38%),linear-gradient(180deg,#02030a_0%,#07102a_48%,#02030a_100%)]" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(214,219,231,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(214,219,231,0.045)_1px,transparent_1px)] [background-size:52px_52px]" />
      {particles.map((particle) => (
        <span
          key={`${particle.left}-${particle.top}`}
          className="absolute rounded-full bg-gold shadow-[0_0_18px_rgba(232,193,96,0.85)] animate-starDrift"
          style={{
            animationDelay: particle.delay,
            height: particle.size,
            left: particle.left,
            top: particle.top,
            width: particle.size
          }}
        />
      ))}

      <div className="relative flex w-full max-w-md flex-col items-center px-6 text-center">
        <div className="absolute top-16 h-52 w-52 rounded-full border border-gold/25 shadow-[0_0_70px_rgba(232,193,96,0.18)] animate-orbitReveal" />
        <div className="absolute top-14 h-56 w-56 rounded-full border border-silver/15 [transform:rotateX(68deg)_rotateZ(-14deg)]" />
        <div className="animate-brandReveal">
          <AceDomainIcon size="lg" />
        </div>

        <div className="relative mt-10 animate-titleForge">
          <div className="absolute inset-x-2 top-1/2 h-px bg-gradient-to-r from-transparent via-gold/80 to-transparent blur-sm" />
          <h1 className="text-[clamp(2rem,9vw,2.25rem)] font-black uppercase leading-none tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-[#F8F1D0] via-gold to-silver drop-shadow-[0_0_28px_rgba(232,193,96,0.28)]">
            Ace Domain
          </h1>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.56em] text-silver/80">
            Meet the World
          </p>
        </div>

        <div className="mt-8 h-px w-40 bg-gradient-to-r from-transparent via-gold/70 to-transparent animate-luxPulse" />
      </div>
    </div>
  );
}
