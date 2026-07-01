import { useState } from 'react';
import { Languages } from 'lucide-react';

type TranslationToggleProps = {
  className?: string;
  compact?: boolean;
  label?: string;
  text: string;
  tone?: 'dark' | 'light';
  translatedText?: string;
};

function mockTranslate(text: string) {
  return `Translation preview: ${text}`;
}

export function TranslationToggle({
  className = '',
  compact = false,
  label = 'Translate',
  text,
  tone = 'dark',
  translatedText
}: TranslationToggleProps) {
  const [translated, setTranslated] = useState(false);
  const currentText = translated ? translatedText ?? mockTranslate(text) : text;
  const muted = tone === 'light' ? 'text-black/55' : 'text-zinc-500';
  const bodyTone = tone === 'light' ? 'text-black/80' : 'text-zinc-100';
  const buttonTone = tone === 'light' ? 'bg-black/10 text-black' : 'border border-white/10 text-zinc-400';

  return (
    <div className={className} aria-live="polite">
      <p className={bodyTone}>{currentText}</p>
      <div className={`mt-2 flex ${compact ? 'items-start' : 'items-center'} flex-wrap gap-2`}>
        {translated && (
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${buttonTone}`}>
            <Languages size={12} />
            Translation preview
          </span>
        )}
        <button
          type="button"
          onClick={() => setTranslated((current) => !current)}
          className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${buttonTone}`}
          aria-label={translated ? 'Show original text' : label}
        >
          {translated ? 'Show original' : label}
        </button>
        {translated && <span className={`text-[10px] leading-4 ${muted}`}>Translations may not always be perfect.</span>}
      </div>
    </div>
  );
}
