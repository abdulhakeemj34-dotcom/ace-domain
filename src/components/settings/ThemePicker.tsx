import { themePresetOrder, themePresets } from '../../features/settings/defaultSettings';
import type { ThemePresetId } from '../../features/settings/settingsTypes';
import { ColorSwatch } from './ColorSwatch';

type ThemePickerProps = {
  onChange: (theme: ThemePresetId) => void;
  value: ThemePresetId;
};

export function ThemePicker({ onChange, value }: ThemePickerProps) {
  return (
    <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2">
      {themePresetOrder.map((themeId) => (
        <ColorSwatch
          key={themeId}
          active={value === themeId}
          preset={themePresets[themeId]}
          onSelect={() => onChange(themeId)}
        />
      ))}
    </div>
  );
}
