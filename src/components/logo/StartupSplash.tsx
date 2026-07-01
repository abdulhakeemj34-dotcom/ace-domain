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
      className={`fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[#020712] transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!isVisible}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(0,71,255,0.34),transparent_42%),radial-gradient(circle_at_50%_82%,rgba(0,240,255,0.14),transparent_40%),linear-gradient(180deg,#020712_0%,#061735_48%,#020712_100%)]" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(0,178,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:52px_52px]" />
      <div className="absolute bottom-[-7rem] h-52 w-[150vw] rounded-[50%] border-t border-cyan-300/35 bg-[radial-gradient(ellipse_at_center,rgba(0,178,255,0.24),transparent_62%)] shadow-[0_0_80px_rgba(0,178,255,0.24)]" />
      {particles.map((particle) => (
        <span
          key={`${particle.left}-${particle.top}`}
          className="absolute rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(0,240,255,0.88)] animate-starDrift"
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
        <div className="absolute top-14 h-52 w-52 rounded-full border border-cyan-300/25 shadow-[0_0_70px_rgba(0,178,255,0.22)] animate-orbitReveal" />
        <div className="absolute top-12 h-56 w-56 rounded-full border border-blue-400/20 [transform:rotateX(68deg)_rotateZ(-14deg)]" />
        <div className="animate-brandReveal">
          <AceDomainIcon size="lg" />
        </div>

        <div className="relative mt-10 animate-titleForge">
          <div className="absolute inset-x-2 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-300/85 to-transparent blur-sm" />
          <h1 className="text-[2rem] font-black uppercase leading-none tracking-[0.16em] text-white drop-shadow-[0_0_30px_rgba(0,178,255,0.34)] sm:text-[2.3rem]">
            Ace Domain
          </h1>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.52em] text-transparent bg-clip-text bg-gradient-to-r from-[#0D47FF] via-[#00B2FF] to-[#00F0FF]">
            Meet the World
          </p>
        </div>

        <div className="mt-8 h-px w-40 bg-gradient-to-r from-transparent via-cyan-300/75 to-transparent animate-luxPulse" />
      </div>
    </div>
  );
}
