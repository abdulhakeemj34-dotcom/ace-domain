import { ArrowRight } from 'lucide-react';
import type { CountryProfile } from '../../types/global';
import { CountryBadge } from './CountryBadge';
import { WorldClockLabel } from './WorldClockLabel';

type CountryCardProps = {
  country: CountryProfile;
  onExplore?: (country: CountryProfile) => void;
};

export function CountryCard({ country, onExplore }: CountryCardProps) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-white/[0.06] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <CountryBadge code={country.code} label={country.name} />
          <p className="mt-3 text-sm text-frost/50">{country.region}</p>
        </div>
        <div className="max-w-full">
          <WorldClockLabel compact timeZone={country.timeZone} />
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-frost/70">{country.funFact}</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-white/[0.06] p-3">
          <p className="text-xs text-frost/45">People</p>
          <p className="mt-1 text-sm font-black text-white">{country.peopleCount}</p>
        </div>
        <div className="rounded-2xl bg-white/[0.06] p-3">
          <p className="text-xs text-frost/45">Popular</p>
          <p className="mt-1 truncate text-sm font-black text-white">{country.popularCommunities[0]}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {country.popularInterests.slice(0, 3).map((interest) => (
          <span key={interest} className="rounded-full bg-aurora/10 px-3 py-1 text-xs font-bold text-aurora">
            {interest}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onExplore?.(country)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-bold text-void"
        aria-label={`Explore ${country.name}`}
      >
        Explore
        <ArrowRight size={16} />
      </button>
    </article>
  );
}
