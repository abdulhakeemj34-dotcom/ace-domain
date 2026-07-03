import { ArrowRight } from 'lucide-react';
import { AceDomainIcon } from '../../components/logo/AceDomainIcon';
import { AceDomainLogo } from '../../components/logo/AceDomainLogo';

type WelcomeScreenProps = {
  onStart: () => void;
  onExploreDemo: () => void;
};

export function WelcomeScreen({ onStart, onExploreDemo }: WelcomeScreenProps) {
  return (
    <section className="flex min-h-[100dvh] flex-col overflow-y-auto bg-black px-5 pb-8 pt-8 text-white">
      <header className="flex items-center justify-between">
        <AceDomainIcon size="sm" withGlow={false} />
        <button
          type="button"
          onClick={onExploreDemo}
          className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white"
        >
          Explore
        </button>
      </header>

      <div className="flex flex-1 flex-col justify-center py-8">
        <div className="mb-8">
          <AceDomainLogo compact />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-zinc-500">Ace Domain</p>
        <h1 className="mt-4 max-w-xs text-5xl font-black leading-[0.95] tracking-tight text-white">
          Meet the world without the noise.
        </h1>
        <p className="mt-5 max-w-sm text-base leading-7 text-zinc-400">
          A black, clean social space for chats, posts, communities, global discovery, and Ace AI.
        </p>
      </div>

      <div className="grid gap-3">
        <button
          type="button"
          onClick={onStart}
          className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-white px-5 text-base font-black text-black"
        >
          Get started
          <ArrowRight size={18} />
        </button>
        <button
          type="button"
          onClick={onExploreDemo}
          className="min-h-14 rounded-full border border-white/15 px-5 text-base font-bold text-white"
        >
          Continue without signup
        </button>
      </div>
    </section>
  );
}
