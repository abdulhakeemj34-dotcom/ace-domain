import { Search, Sparkles } from 'lucide-react';

type SearchBarProps = {
  placeholder?: string;
};

export function SearchBar({ placeholder = 'Ask Ace AI to find people, places, ideas...' }: SearchBarProps) {
  return (
    <label className="mx-5 mt-3 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-frost/70 backdrop-blur-xl">
      <Sparkles size={18} className="text-aurora" />
      <input
        className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-frost/40"
        placeholder={placeholder}
        aria-label="AI-powered search"
      />
      <Search size={18} />
    </label>
  );
}
