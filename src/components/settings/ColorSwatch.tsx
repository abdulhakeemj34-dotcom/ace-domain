import type { CSSProperties } from 'react';
import type { ThemePreset } from '../../features/settings/settingsTypes';

type ColorSwatchProps = {
  active: boolean;
  onSelect: () => void;
  preset: ThemePreset;
};

export function ColorSwatch({ active, onSelect, preset }: ColorSwatchProps) {
  const swatchStyle: CSSProperties = {
    background: `linear-gradient(135deg, ${preset.accentStrong}, ${preset.accent})`,
    boxShadow: active ? `0 0 30px ${preset.glow}` : undefined
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-[24px] border p-3 text-left transition duration-300 ${
        active ? 'border-white/35 bg-white/[0.1]' : 'border-white/10 bg-white/[0.045] hover:border-white/20'
      }`}
      aria-pressed={active}
    >
      <span className="mb-3 block h-11 rounded-2xl" style={swatchStyle} />
      <span className="block text-sm font-black text-white">{preset.name}</span>
      <span className="mt-1 block text-xs leading-5 text-frost/45">{preset.description}</span>
    </button>
  );
}
