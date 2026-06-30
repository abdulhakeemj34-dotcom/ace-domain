import { Globe2, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '../../components/Button';
import { AceDomainIcon } from '../../components/logo/AceDomainIcon';
import { AceDomainLogo } from '../../components/logo/AceDomainLogo';

type WelcomeScreenProps = {
  onStart: () => void;
  onExploreDemo: () => void;
};

export function WelcomeScreen({ onStart, onExploreDemo }: WelcomeScreenProps) {
  return (
    <section className="flex min-h-screen flex-col px-5 py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-aurora">Ace Domain</p>
          <h1 className="mt-2 text-4xl font-black leading-tight text-white">Meet the World.</h1>
        </div>
        <AceDomainIcon size="md" withGlow={false} />
      </div>

      <div className="relative my-10 flex flex-1 items-center justify-center">
        <AceDomainLogo />
      </div>

      <div className="glass-panel rounded-[32px] p-5 animate-rise">
        <h2 className="text-2xl font-bold text-white">Your premium social universe.</h2>
        <p className="mt-3 text-sm leading-6 text-frost/70">
          Chat, play, discover, and connect globally.
        </p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { icon: Zap, label: 'Fast' },
            { icon: ShieldCheck, label: 'Trusted' },
            { icon: Globe2, label: 'Global' }
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-white/[0.06] p-3 text-center">
              <item.icon className="mx-auto text-aurora" size={20} />
              <p className="mt-2 text-xs font-semibold text-white">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-3">
          <Button onClick={onStart} className="w-full py-4">
            Get Started
          </Button>
          <Button onClick={onExploreDemo} variant="secondary" className="w-full py-4">
            Explore Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
