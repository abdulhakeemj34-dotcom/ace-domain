import { Search, Sparkles } from 'lucide-react';

type SearchBarProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export function SearchBar({ placeholder = 'Ask Ace AI to find people, places, ideas...', value, onChange }: SearchBarProps) {
  return (
    <label className="mx-4 mt-2 flex min-h-12 items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.07] px-3.5 py-2.5 text-sm text-frost/70 backdrop-blur-xl">
      <Sparkles size={17} className="shrink-0 text-aurora" />
      <input
        className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-frost/40"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        aria-label="Smart discovery search"
      />
      <Search size={17} className="shrink-0" />
    </label>
  );
}
