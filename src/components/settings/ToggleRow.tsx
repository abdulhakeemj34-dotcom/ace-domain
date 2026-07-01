import type { ReactNode } from 'react';

type ToggleRowProps = {
  checked: boolean;
  description: string;
  icon?: ReactNode;
  label: string;
  onChange: () => void;
};

export function ToggleRow({ checked, description, icon, label, onChange }: ToggleRowProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center gap-3 rounded-[20px] border border-white/10 bg-white/[0.055] p-3 text-left transition duration-300 hover:border-white/20"
      aria-pressed={checked}
    >
      {icon && (
        <div
          className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl"
          style={checked ? { backgroundColor: 'var(--ad-accent)', color: 'var(--ad-accent-contrast)' } : undefined}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="mt-1 text-sm leading-5 text-frost/50">{description}</p>
      </div>
      <span className="h-6 w-11 shrink-0 rounded-full p-1 transition duration-300" style={{ backgroundColor: checked ? 'var(--ad-accent)' : 'rgba(255, 255, 255, 0.15)' }}>
        <span className={`block h-4 w-4 rounded-full bg-white transition duration-300 ${checked ? 'translate-x-5' : ''}`} />
      </span>
    </button>
  );
}
