import { useMemo, useState, type FormEvent } from 'react';
import { ArrowLeft, EyeOff, Gauge, ShieldCheck, Type } from 'lucide-react';
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
  disabled?: boolean;
  icon?: typeof ShieldCheck;
  label: string;
  onChange: () => void;
};

type SafetyReport = {
  createdAt: string;
  details: string;
  id: string;
  status: 'Ready for support review';
  target: string;
  type: string;
};

const BLOCKED_USERS_KEY = 'ace-domain.blocked-users';
const SAFETY_REPORTS_KEY = 'ace-domain.safety-reports';
const reportTypes = ['Harassment or bullying', 'Spam or scam', 'Hate or abuse', 'Unsafe message', 'Other'];
const supportEmail = 'support@acedomain.app';

function readStringList(key: string) {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : [];
  } catch {
    return [];
  }
}

function writeStringList(key: string, value: string[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Safety controls remain usable in memory if localStorage is unavailable.
  }
}

function readSafetyReports() {
  try {
    const raw = window.localStorage.getItem(SAFETY_REPORTS_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((item): item is SafetyReport => {
        if (typeof item !== 'object' || item === null || Array.isArray(item)) {
          return false;
        }

        const record = item as Partial<SafetyReport>;
        return typeof record.id === 'string' && typeof record.target === 'string' && typeof record.type === 'string';
      })
      : [];
  } catch {
    return [];
  }
}

function writeSafetyReports(value: SafetyReport[]) {
  try {
    window.localStorage.setItem(SAFETY_REPORTS_KEY, JSON.stringify(value));
  } catch {
    // Safety reports remain visible in memory if localStorage is unavailable.
  }
}

function createLocalId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function ToggleRow({ checked, description, disabled = false, icon: Icon = ShieldCheck, label, onChange }: ToggleRowProps) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onChange}
      disabled={disabled}
      className={`flex w-full min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-black p-4 text-left ${
        disabled ? 'cursor-not-allowed opacity-60' : ''
      }`}
      aria-pressed={checked}
    >
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 ${checked ? 'bg-white text-black' : 'text-zinc-500'}`}>
        <Icon size={19} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-white">{label}</p>
        <p className="mt-1 text-sm leading-5 text-frost/55">{description}</p>
      </div>
      <span className={`h-7 w-12 shrink-0 rounded-full border border-white/10 p-1 transition ${checked ? 'bg-white' : 'bg-zinc-900'}`}>
        <span className={`block h-5 w-5 rounded-full transition ${checked ? 'translate-x-5 bg-black' : 'bg-white'}`} />
      </span>
    </button>
  );
}

function SafetyModerationPanel() {
  const [blockedInput, setBlockedInput] = useState('');
  const [blockedUsers, setBlockedUsers] = useState(() => readStringList(BLOCKED_USERS_KEY));
  const [reportDetails, setReportDetails] = useState('');
  const [reportTarget, setReportTarget] = useState('');
  const [reportType, setReportType] = useState(reportTypes[0]);
  const [reports, setReports] = useState(readSafetyReports);
  const [notice, setNotice] = useState('');
  const supportHref = useMemo(() => {
    const subject = encodeURIComponent('Ace Domain safety report');
    const body = encodeURIComponent(`Report type: ${reportType}\nUser/content: ${reportTarget}\nDetails: ${reportDetails}\n\nPlease review this Ace Domain safety report.`);
    return `mailto:${supportEmail}?subject=${subject}&body=${body}`;
  }, [reportDetails, reportTarget, reportType]);

  const addBlockedUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = blockedInput.trim().replace(/\s+/g, ' ');

    if (!value) {
      setNotice('Enter a username, handle, or email to block.');
      return;
    }

    if (blockedUsers.some((item) => item.toLowerCase() === value.toLowerCase())) {
      setNotice(`${value} is already on your blocked list.`);
      return;
    }

    const next = [value, ...blockedUsers].slice(0, 50);
    setBlockedUsers(next);
    writeStringList(BLOCKED_USERS_KEY, next);
    setBlockedInput('');
    setNotice(`${value} added to your local blocked list.`);
  };

  const removeBlockedUser = (value: string) => {
    const next = blockedUsers.filter((item) => item !== value);
    setBlockedUsers(next);
    writeStringList(BLOCKED_USERS_KEY, next);
    setNotice(`${value} removed from your blocked list.`);
  };

  const submitReport = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = reportTarget.trim().replace(/\s+/g, ' ');
    const details = reportDetails.trim();

    if (!target || !details) {
      setNotice('Add the user/content and a short report detail first.');
      return;
    }

    const report: SafetyReport = {
      createdAt: new Date().toISOString(),
      details,
      id: createLocalId('report'),
      status: 'Ready for support review',
      target,
      type: reportType
    };
    const next = [report, ...reports].slice(0, 25);
    setReports(next);
    writeSafetyReports(next);
    setReportTarget('');
    setReportDetails('');
    setNotice('Report saved locally. Use Send to support for human review.');
  };

  return (
    <div className="space-y-3 rounded-[28px] border border-white/10 bg-black p-4">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.22em] text-frost/40">Safety & moderation</p>
        <h2 className="mt-1 text-xl font-black text-white">Report and block controls</h2>
        <p className="mt-2 text-sm leading-6 text-frost/55">
          Block users on this device, save report history, and send safety reports to support for review.
        </p>
      </div>

      <form className="space-y-2" onSubmit={addBlockedUser}>
        <label className="text-xs font-bold uppercase tracking-[0.2em] text-frost/45" htmlFor="block-user-input">
          Block user
        </label>
        <div className="flex gap-2">
          <input
            id="block-user-input"
            value={blockedInput}
            onChange={(event) => setBlockedInput(event.target.value)}
            className="min-h-11 min-w-0 flex-1 rounded-full border border-white/10 bg-zinc-950 px-4 text-sm text-white outline-none placeholder:text-frost/35"
            placeholder="@username or email"
          />
          <button type="submit" className="min-h-11 shrink-0 rounded-full bg-white px-4 text-sm font-black text-black">
            Block
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {blockedUsers.length === 0 ? (
          <p className="rounded-2xl border border-white/10 p-3 text-sm text-zinc-500">No blocked users on this device.</p>
        ) : (
          blockedUsers.slice(0, 5).map((user) => (
            <div key={user} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 p-3">
              <span className="min-w-0 truncate text-sm font-bold text-white">{user}</span>
              <button type="button" onClick={() => removeBlockedUser(user)} className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold text-zinc-300">
                Unblock
              </button>
            </div>
          ))
        )}
      </div>

      <form className="space-y-3 border-t border-white/10 pt-4" onSubmit={submitReport}>
        <label className="text-xs font-bold uppercase tracking-[0.2em] text-frost/45" htmlFor="report-target-input">
          Report user or content
        </label>
        <input
          id="report-target-input"
          value={reportTarget}
          onChange={(event) => setReportTarget(event.target.value)}
          className="min-h-11 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 text-sm text-white outline-none placeholder:text-frost/35"
          placeholder="@username, chat name, post, or community"
        />
        <select
          value={reportType}
          onChange={(event) => setReportType(event.target.value)}
          className="min-h-11 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 text-sm text-white outline-none"
          aria-label="Report reason"
        >
          {reportTypes.map((type) => <option key={type}>{type}</option>)}
        </select>
        <textarea
          value={reportDetails}
          onChange={(event) => setReportDetails(event.target.value)}
          className="min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-frost/35"
          placeholder="What happened?"
        />
        <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
          <button type="submit" className="min-h-11 rounded-full bg-white px-4 text-sm font-black text-black">
            Save report
          </button>
          <a href={supportHref} className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 px-4 text-sm font-black text-white">
            Send to support
          </a>
        </div>
      </form>

      <div className="space-y-2 border-t border-white/10 pt-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-frost/45">Recent reports</p>
        {reports.length === 0 ? (
          <p className="rounded-2xl border border-white/10 p-3 text-sm text-zinc-500">No local report history yet.</p>
        ) : (
          reports.slice(0, 3).map((report) => (
            <div key={report.id} className="rounded-2xl border border-white/10 p-3">
              <p className="truncate text-sm font-bold text-white">{report.target}</p>
              <p className="mt-1 text-xs text-zinc-500">{report.type} / {report.status}</p>
            </div>
          ))
        )}
      </div>

      {notice && (
        <p className="rounded-full border border-white/10 px-4 py-2 text-center text-xs font-bold text-zinc-400" role="status">
          {notice}
        </p>
      )}
    </div>
  );
}

export function GlobalSettingsScreen({ onBack, onChange, settings }: GlobalSettingsScreenProps) {
  const update = (patch: Partial<GlobalSafetySettings>) => {
    onChange({ ...settings, ...patch });
  };

  return (
    <section className="animate-rise pb-8">
      <header className="ad-safe-header-loose px-5 pb-4">
        <button type="button" onClick={onBack} className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white" aria-label="Back to profile">
          <ArrowLeft size={20} />
        </button>
        <div className="border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-white text-black">
              <ShieldCheck size={23} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-zinc-500">Trust controls</p>
              <h1 className="truncate text-3xl font-black text-white">Global Safety</h1>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-frost/65">
            Local controls for safer global discovery, privacy, reporting, blocking, low-data use, and accessibility.
          </p>
          {settings.lowDataMode && (
            <span className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black text-black">Low-data mode active</span>
          )}
        </div>
      </header>

      <div className="space-y-5 px-5">
        <SafetyNoticeCard
          title="Stranger safety"
          body="Keep first conversations inside Ace Domain, avoid sending money or private codes, and report pressure, scams, or harassment."
        />

        <div className="grid gap-3">
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

        <SafetyModerationPanel />

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
          </div>
        </div>
      </div>
    </section>
  );
}
