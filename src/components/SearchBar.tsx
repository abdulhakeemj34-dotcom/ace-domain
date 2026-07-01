import { Search } from 'lucide-react';

type SearchBarProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export function SearchBar({ placeholder = 'Ask Ace AI to find people, places, ideas...', value, onChange }: SearchBarProps) {
  return (
    <label className="mx-4 mt-3 flex min-h-11 items-center gap-2.5 rounded-full border border-white/10 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-400">
      <Search size={17} className="shrink-0" />
      <input
        className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-zinc-500"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        aria-label="Smart discovery search"
      />
    </label>
  );
}
