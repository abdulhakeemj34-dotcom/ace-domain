import { ArrowLeft, Globe2, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { CountryBadge } from '../../components/global/CountryBadge';
import { CountryCard } from '../../components/global/CountryCard';
import { CultureFactCard } from '../../components/global/CultureFactCard';
import { SafetyNoticeCard } from '../../components/global/SafetyNoticeCard';
import { WorldClockLabel } from '../../components/global/WorldClockLabel';
import { LanguageBadge } from '../../components/language/LanguageBadge';
import { countryProfiles, cultureFacts, globalPeople, languageOptions } from '../../data/mockGlobalData';
import type { CountryProfile } from '../../types/global';
import { CountryDetailScreen } from './CountryDetailScreen';

type GlobalDiscoveryScreenProps = {
  onBack: () => void;
  onOpenCalendar: () => void;
  onStartChat: () => void;
};

type MatchFilters = {
  country: string;
  gamerType: string;
  interest: string;
  language: string;
  mode: string;
  onlineOnly: boolean;
  timeZone: string;
};

const initialFilters: MatchFilters = {
  country: 'All',
  gamerType: 'All',
  interest: 'All',
  language: 'All',
  mode: 'All',
  onlineOnly: false,
  timeZone: 'All'
};

function selectClass() {
  return 'w-full rounded-3xl border border-white/10 bg-void px-3 py-3 text-sm text-white outline-none';
}

export function GlobalDiscoveryScreen({ onBack, onOpenCalendar, onStartChat }: GlobalDiscoveryScreenProps) {
  const [filters, setFilters] = useState(initialFilters);
  const [selectedCountry, setSelectedCountry] = useState<CountryProfile | null>(null);
  const countries = ['All', ...countryProfiles.map((country) => country.name)];
  const interests = ['All', ...Array.from(new Set(globalPeople.flatMap((person) => person.interests)))];
  const gamerTypes = ['All', ...Array.from(new Set(globalPeople.map((person) => person.gamerType)))];
  const timeZones = ['All', ...Array.from(new Set(globalPeople.map((person) => person.timeZone)))];
  const modes = ['All', 'Campus', 'Global'];

  const filteredPeople = useMemo(() => {
    return globalPeople.filter((person) => {
      if (filters.country !== 'All' && person.country !== filters.country) {
        return false;
      }
      if (filters.language !== 'All' && !person.languages.includes(filters.language) && !person.learning.includes(filters.language)) {
        return false;
      }
      if (filters.interest !== 'All' && !person.interests.includes(filters.interest)) {
        return false;
      }
      if (filters.gamerType !== 'All' && person.gamerType !== filters.gamerType) {
        return false;
      }
      if (filters.timeZone !== 'All' && person.timeZone !== filters.timeZone) {
        return false;
      }
      if (filters.mode !== 'All' && person.mode !== filters.mode) {
        return false;
      }
      if (filters.onlineOnly && !person.onlineNow) {
        return false;
      }
      return true;
    });
  }, [filters]);

  if (selectedCountry) {
    return <CountryDetailScreen country={selectedCountry} onBack={() => setSelectedCountry(null)} />;
  }

  return (
    <section className="animate-rise pb-8">
      <header className="px-5 pb-4 pt-8">
        <button type="button" onClick={onBack} className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white" aria-label="Back to home">
          <ArrowLeft size={20} />
        </button>
        <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-aurora/20 via-white/[0.06] to-signal/10 p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-void">
              <Globe2 size={23} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-aurora">Meet the world</p>
              <h1 className="text-3xl font-black text-white">Global Discovery</h1>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-frost/65">
            Explore regions, languages, local times, culture prompts, and people who match your interests.
          </p>
          <Button onClick={onOpenCalendar} className="mt-4 w-full">
            Open Global Calendar
          </Button>
        </div>
      </header>

      <div className="space-y-5 px-5">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.06] p-4">
          <div className="flex items-center gap-3">
            <SlidersHorizontal size={20} className="text-aurora" />
            <div>
              <h2 className="font-bold text-white">Global Match filters</h2>
              <p className="text-sm text-frost/50">Local-state filtering for Stage 4A.</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <select className={selectClass()} value={filters.country} onChange={(event) => setFilters((current) => ({ ...current, country: event.target.value }))} aria-label="Filter by country">
              {countries.map((country) => <option key={country}>{country}</option>)}
            </select>
            <select className={selectClass()} value={filters.language} onChange={(event) => setFilters((current) => ({ ...current, language: event.target.value }))} aria-label="Filter by language">
              {['All', ...languageOptions].map((language) => <option key={language}>{language}</option>)}
            </select>
            <select className={selectClass()} value={filters.interest} onChange={(event) => setFilters((current) => ({ ...current, interest: event.target.value }))} aria-label="Filter by interest">
              {interests.map((interest) => <option key={interest}>{interest}</option>)}
            </select>
            <select className={selectClass()} value={filters.gamerType} onChange={(event) => setFilters((current) => ({ ...current, gamerType: event.target.value }))} aria-label="Filter by gamer type">
              {gamerTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
            <select className={selectClass()} value={filters.timeZone} onChange={(event) => setFilters((current) => ({ ...current, timeZone: event.target.value }))} aria-label="Filter by time zone">
              {timeZones.map((zone) => <option key={zone}>{zone}</option>)}
            </select>
            <select className={selectClass()} value={filters.mode} onChange={(event) => setFilters((current) => ({ ...current, mode: event.target.value }))} aria-label="Filter by campus or global mode">
              {modes.map((mode) => <option key={mode}>{mode}</option>)}
            </select>
          </div>
          <button
            type="button"
            onClick={() => setFilters((current) => ({ ...current, onlineOnly: !current.onlineOnly }))}
            className={`mt-3 w-full rounded-full px-4 py-3 text-sm font-bold ${filters.onlineOnly ? 'bg-aurora text-void' : 'bg-white/10 text-frost/65'}`}
          >
            {filters.onlineOnly ? 'Online now only' : 'Include offline people'}
          </button>
        </div>

        <div className="grid gap-3">
          {filteredPeople.map((person) => (
            <article key={person.id} className="rounded-[30px] border border-white/10 bg-white/[0.06] p-4">
              <div className="flex items-start gap-3">
                <Avatar label={person.avatar} active={person.onlineNow} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="truncate font-bold text-white">{person.name}</h2>
                    <CountryBadge code={person.countryCode} />
                  </div>
                  <p className="mt-1 text-xs text-frost/50">{person.city}, {person.country} / {person.mode}</p>
                  <div className="mt-2">
                    <WorldClockLabel compact timeZone={person.timeZone} />
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-frost/65">{person.bio}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {person.languages.map((language) => <LanguageBadge key={language} label={language} />)}
                {person.learning.map((language) => <LanguageBadge key={language} label={language} tone="learning" />)}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {person.interests.map((interest) => (
                  <span key={interest} className="rounded-full bg-plasma/10 px-3 py-1 text-xs font-bold text-plasma">{interest}</span>
                ))}
              </div>
              <div className="mt-4 grid gap-2 rounded-2xl bg-white/[0.05] p-3 text-xs text-frost/55">
                <p>Gamer type: <span className="font-bold text-white">{person.gamerType}</span></p>
                <p>Safety: <span className="font-bold text-aurora">{person.messageSafety}</span></p>
              </div>
              <Button onClick={onStartChat} className="mt-4 w-full" aria-label={`Start chat with ${person.name}`}>
                Start Chat
              </Button>
            </article>
          ))}
          {filteredPeople.length === 0 && (
            <p className="rounded-[26px] border border-white/10 bg-white/[0.06] p-4 text-sm text-frost/55">
              No local matches fit these filters yet. Clear one filter and try again.
            </p>
          )}
        </div>

        <SafetyNoticeCard body="Message requests, block, report, hide country, and hide online status are local controls in Stage 4A. Real moderation backend comes later." />

        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-frost/50">Country discovery</h2>
          <div className="grid gap-3">
            {countryProfiles.map((country) => (
              <CountryCard key={country.id} country={country} onExplore={setSelectedCountry} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-frost/50">Culture starters</h2>
          <div className="grid gap-3">
            {cultureFacts.slice(0, 4).map((fact) => (
              <CultureFactCard key={fact.id} fact={fact} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
