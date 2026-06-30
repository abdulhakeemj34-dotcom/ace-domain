import { ArrowLeft, Ban, EyeOff, Flag, Gauge, MessageCircle, ShieldCheck, Type } from 'lucide-react';
import { useState } from 'react';
import { SafetyNoticeCard } from '../../components/global/SafetyNoticeCard';
import type { GlobalSafetySettings } from '../../types/global';

type GlobalSettingsScreenProps = {
  onBack: () => void;
  onChange: (settings: GlobalSafetySettings) => void;
  settings: GlobalSafetySettings;
};

type ToggleRowProps = {
  checked: boolean;
  description: string;
  icon?: typeof ShieldCheck;
  label: string;
  onChange: () => void;
};

function ToggleRow({ checked, description, icon: Icon = ShieldCheck, label, onChange }: ToggleRowProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center gap-3 rounded-[24px] border border-white/10 bg-white/[0.06] p-4 text-left"
      aria-pressed={checked}
    >
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${checked ? 'bg-aurora text-void' : 'bg-white/10 text-frost/65'}`}>
        <Icon size={19} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-white">{label}</p>
        <p className="mt-1 text-sm leading-5 text-frost/55">{description}</p>
      </div>
      <span className={`h-7 w-12 shrink-0 rounded-full p-1 transition ${checked ? 'bg-aurora' : 'bg-white/15'}`}>
        <span className={`block h-5 w-5 rounded-full bg-white transition ${checked ? 'translate-x-5' : ''}`} />
      </span>
    </button>
  );
}

export function GlobalSettingsScreen({ onBack, onChange, settings }: GlobalSettingsScreenProps) {
  const [status, setStatus] = useState('');

  const update = (patch: Partial<GlobalSafetySettings>) => {
    onChange({ ...settings, ...patch });
  };

  return (
    <section className="animate-rise pb-8">
      <header className="px-5 pb-4 pt-8">
        <button type="button" onClick={onBack} className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white" aria-label="Back to profile">
          <ArrowLeft size={20} />
        </button>
        <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-aurora/15 via-white/[0.06] to-plasma/10 p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-void">
              <ShieldCheck size={23} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-aurora">Stage 4A</p>
              <h1 className="text-3xl font-black text-white">Global Safety</h1>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-frost/65">
            Local controls for safer global discovery, privacy, low-data use, and accessibility. Real moderation backend comes later.
          </p>
          {settings.lowDataMode && (
            <span className="mt-4 inline-flex rounded-full bg-signal px-3 py-1 text-xs font-black text-void">Low-data mode active</span>
          )}
        </div>
      </header>

      <div className="space-y-5 px-5">
        <SafetyNoticeCard
          title="Stranger safety"
          body="Keep first conversations inside Ace Domain, avoid sending money or private codes, and report pressure, scams, or harassment."
        />

        <div className="rounded-[30px] border border-white/10 bg-white/[0.06] p-4">
          <h2 className="font-bold text-white">Who can message me</h2>
          <select
            value={settings.whoCanMessage}
            onChange={(event) => update({ whoCanMessage: event.target.value as GlobalSafetySettings['whoCanMessage'] })}
            className="mt-3 w-full rounded-3xl border border-white/10 bg-void px-4 py-3 text-sm text-white outline-none"
            aria-label="Choose who can message me"
          >
            <option>Everyone</option>
            <option>Friends of friends</option>
            <option>Only friends</option>
          </select>
        </div>

        <div className="grid gap-3">
          <ToggleRow
            checked={settings.messageRequests}
            description="Strangers start in a request state before full chat access."
            icon={MessageCircle}
            label="Message requests from strangers"
            onChange={() => update({ messageRequests: !settings.messageRequests })}
          />
          <ToggleRow
            checked={settings.hideCountry}
            description="Keep your country badge hidden on discovery cards."
            icon={EyeOff}
            label="Hide country"
            onChange={() => update({ hideCountry: !settings.hideCountry })}
          />
          <ToggleRow
            checked={settings.hideOnlineStatus}
            description="Do not show whether you are online right now."
            icon={EyeOff}
            label="Hide online status"
            onChange={() => update({ hideOnlineStatus: !settings.hideOnlineStatus })}
          />
          <ToggleRow
            checked={settings.hideLocalTime}
            description="Hide local time labels on your profile and match cards."
            icon={EyeOff}
            label="Hide local time"
            onChange={() => update({ hideLocalTime: !settings.hideLocalTime })}
          />
          <ToggleRow
            checked={settings.hideLanguages}
            description="Keep spoken and learning languages private."
            icon={EyeOff}
            label="Hide languages"
            onChange={() => update({ hideLanguages: !settings.hideLanguages })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setStatus('Block UI staged locally. Real block lists arrive with moderation services.')}
            className="flex items-center justify-center gap-2 rounded-3xl bg-white/10 px-4 py-3 text-sm font-bold text-white"
          >
            <Ban size={17} />
            Block user UI
          </button>
          <button
            type="button"
            onClick={() => setStatus('Report UI staged locally. Real reports will connect to moderation later.')}
            className="flex items-center justify-center gap-2 rounded-3xl bg-plasma/15 px-4 py-3 text-sm font-bold text-plasma"
          >
            <Flag size={17} />
            Report user UI
          </button>
        </div>
        {status && <p className="rounded-3xl bg-white/[0.06] p-3 text-sm leading-6 text-frost/60">{status}</p>}

        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-frost/50">Low-data mode</h2>
          <ToggleRow
            checked={settings.lowDataMode}
            description="Reduces motion and marks compact, data-aware UI states for expensive networks."
            icon={Gauge}
            label="Low-data mode"
            onChange={() => update({ lowDataMode: !settings.lowDataMode })}
          />
        </div>

        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-frost/50">Accessibility</h2>
          <div className="grid gap-3">
            <ToggleRow
              checked={settings.biggerText}
              description="Slightly increases app text size."
              icon={Type}
              label="Bigger text"
              onChange={() => update({ biggerText: !settings.biggerText })}
            />
            <ToggleRow
              checked={settings.reducedMotion}
              description="Reduces animated motion across the app."
              icon={Gauge}
              label="Reduced motion"
              onChange={() => update({ reducedMotion: !settings.reducedMotion })}
            />
            <ToggleRow
              checked={settings.highContrast}
              description="Boosts panel contrast for readability."
              icon={ShieldCheck}
              label="High contrast"
              onChange={() => update({ highContrast: !settings.highContrast })}
            />
            <ToggleRow
              checked={settings.clearerLabels}
              description="Keeps direct labels visible on key global controls."
              icon={Type}
              label="Clearer labels"
              onChange={() => update({ clearerLabels: !settings.clearerLabels })}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
