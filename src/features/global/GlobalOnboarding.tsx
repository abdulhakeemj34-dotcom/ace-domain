import { useMemo, useState } from 'react';
import { Globe2, X } from 'lucide-react';
import { countryProfiles, defaultGlobalProfile, focusOptions, languageOptions } from '../../data/mockGlobalData';
import type { GlobalFocus, GlobalOnboardingProfile } from '../../types/global';

type GlobalOnboardingProps = {
  onComplete: (profile: GlobalOnboardingProfile) => void;
  onSkip: () => void;
};

const interestOptions = ['Gaming', 'Music', 'Coding', 'Food', 'Culture', 'Travel', 'Anime', 'Football', 'Campus', 'Startups'];

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function GlobalOnboarding({ onComplete, onSkip }: GlobalOnboardingProps) {
  const [profile, setProfile] = useState(defaultGlobalProfile);
  const selectedCountry = useMemo(
    () => countryProfiles.find((country) => country.name === profile.country) ?? countryProfiles[0],
    [profile.country]
  );

  const updateCountry = (countryName: string) => {
    const country = countryProfiles.find((item) => item.name === countryName);
    setProfile((current) => ({
      ...current,
      country: country?.name ?? countryName,
      region: country?.region ?? current.region
    }));
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center overflow-y-auto bg-void/85 px-4 py-4 backdrop-blur-2xl sm:items-center">
      <form
        className="max-h-[calc(100svh-2rem)] w-full max-w-md overflow-y-auto rounded-[34px] border border-white/10 bg-obsidian p-5 shadow-panel animate-rise"
        onSubmit={(event) => {
          event.preventDefault();
          onComplete(profile);
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-aurora">Global setup</p>
            <h2 className="mt-2 text-2xl font-black text-white">Tune your world</h2>
            <p className="mt-2 text-sm leading-6 text-frost/60">
              Local-only setup for country, language, focus, and discovery preferences.
            </p>
          </div>
          <button type="button" onClick={onSkip} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-white" aria-label="Skip global setup">
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 rounded-[28px] border border-white/10 bg-white/[0.06] p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-void">
              <Globe2 size={21} />
            </div>
            <div>
              <h3 className="font-bold text-white">Country and region</h3>
              <p className="text-xs text-frost/50">{selectedCountry.region} / {selectedCountry.timeZone}</p>
            </div>
          </div>
          <label className="mt-4 block text-xs font-bold uppercase tracking-[0.2em] text-frost/45">
            Country
            <select
              value={profile.country}
              onChange={(event) => updateCountry(event.target.value)}
              className="mt-2 w-full rounded-3xl border border-white/10 bg-void px-4 py-3 text-sm normal-case tracking-normal text-white outline-none"
            >
              {countryProfiles.map((country) => (
                <option key={country.id} value={country.name}>{country.name}</option>
              ))}
            </select>
          </label>
          <label className="mt-3 block text-xs font-bold uppercase tracking-[0.2em] text-frost/45">
            Preferred app language
            <select
              value={profile.appLanguage}
              onChange={(event) => setProfile((current) => ({ ...current, appLanguage: event.target.value }))}
              className="mt-2 w-full rounded-3xl border border-white/10 bg-void px-4 py-3 text-sm normal-case tracking-normal text-white outline-none"
            >
              {languageOptions.map((language) => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 grid gap-4">
          <div>
            <h3 className="text-sm font-bold text-white">Languages spoken</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {languageOptions.slice(0, 8).map((language) => {
                const active = profile.languagesSpoken.includes(language);
                return (
                  <button
                    key={language}
                    type="button"
                    onClick={() => setProfile((current) => ({ ...current, languagesSpoken: toggleValue(current.languagesSpoken, language) }))}
                    className={`rounded-full px-3 py-2 text-xs font-bold ${active ? 'bg-aurora text-void' : 'bg-white/10 text-frost/65'}`}
                  >
                    {language}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">Languages learning</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {languageOptions.slice(1).map((language) => {
                const active = profile.languagesLearning.includes(language);
                return (
                  <button
                    key={language}
                    type="button"
                    onClick={() => setProfile((current) => ({ ...current, languagesLearning: toggleValue(current.languagesLearning, language) }))}
                    className={`rounded-full px-3 py-2 text-xs font-bold ${active ? 'bg-signal text-void' : 'bg-white/10 text-frost/65'}`}
                  >
                    {language}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">Focus</h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {focusOptions.map((focus) => {
                const active = profile.focus === focus;
                return (
                  <button
                    key={focus}
                    type="button"
                    onClick={() => setProfile((current) => ({ ...current, focus: focus as GlobalFocus }))}
                    className={`rounded-3xl px-3 py-3 text-xs font-bold ${active ? 'bg-white text-void' : 'bg-white/10 text-frost/65'}`}
                  >
                    {focus}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">Interests</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {interestOptions.map((interest) => {
                const active = profile.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => setProfile((current) => ({ ...current, interests: toggleValue(current.interests, interest) }))}
                    className={`rounded-full px-3 py-2 text-xs font-bold ${active ? 'bg-plasma/80 text-white' : 'bg-white/10 text-frost/65'}`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" onClick={onSkip} className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-white">
            Skip
          </button>
          <button type="submit" className="rounded-full bg-white px-5 py-3 text-sm font-bold text-void">
            Save Setup
          </button>
        </div>
      </form>
    </div>
  );
}
