import { ArrowLeft, MapPinned } from 'lucide-react';
import { CountryBadge } from '../../components/global/CountryBadge';
import { CultureFactCard } from '../../components/global/CultureFactCard';
import { SafetyNoticeCard } from '../../components/global/SafetyNoticeCard';
import { WorldClockLabel } from '../../components/global/WorldClockLabel';
import { LanguageBadge } from '../../components/language/LanguageBadge';
import { cultureFacts } from '../../data/mockGlobalData';
import type { CountryProfile } from '../../types/global';

type CountryDetailScreenProps = {
  country: CountryProfile;
  onBack: () => void;
};

export function CountryDetailScreen({ country, onBack }: CountryDetailScreenProps) {
  const localFacts = cultureFacts.filter((fact) => fact.country === country.name);
  const facts = localFacts.length > 0 ? localFacts : cultureFacts.slice(0, 2);

  return (
    <section className="animate-rise pb-8">
      <header className="px-5 pb-4 pt-8">
        <button type="button" onClick={onBack} className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white" aria-label="Back to global discovery">
          <ArrowLeft size={20} />
        </button>
        <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-white/[0.09] via-white/[0.05] to-aurora/[0.08] p-5">
          <CountryBadge code={country.code} label={country.name} />
          <h1 className="mt-4 text-3xl font-black text-white">{country.region}</h1>
          <p className="mt-3 text-sm leading-6 text-frost/65">{country.greeting}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <WorldClockLabel timeZone={country.timeZone} />
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-frost/65">{country.peopleCount}</span>
          </div>
        </div>
      </header>

      <div className="space-y-5 px-5">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-aurora/15 text-aurora">
              <MapPinned size={20} />
            </div>
            <div>
              <h2 className="font-bold text-white">Local trends</h2>
              <p className="text-sm text-frost/50">Discovery signals for culture, events, and local conversation starters.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            {country.localTrends.map((trend) => (
              <div key={trend} className="rounded-2xl bg-white/[0.06] px-3 py-2 text-sm font-bold text-white">
                {trend}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-4">
          <h2 className="font-bold text-white">Languages and interests</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {country.languages.map((language) => (
              <LanguageBadge key={language} label={language} />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {country.popularInterests.map((interest) => (
              <span key={interest} className="rounded-full bg-plasma/10 px-3 py-1 text-xs font-bold text-plasma">
                {interest}
              </span>
            ))}
          </div>
        </div>

        <SafetyNoticeCard body="Before messaging someone from a new region, keep the first message respectful, avoid pressure, and use report or block controls if anything feels wrong." />

        <div className="grid gap-3">
          {facts.map((fact) => (
            <CultureFactCard key={fact.id} fact={fact} />
          ))}
        </div>
      </div>
    </section>
  );
}
