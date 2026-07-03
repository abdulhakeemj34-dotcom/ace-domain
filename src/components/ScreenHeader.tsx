import type { ReactNode } from 'react';

type ScreenHeaderProps = {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
};

export function ScreenHeader({ eyebrow, title, action }: ScreenHeaderProps) {
  return (
    <header className="ad-safe-header sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-white/10 bg-black/95 px-4 pb-3 backdrop-blur-xl">
      <div className="min-w-0">
        {eyebrow && <p className="truncate text-[11px] font-semibold text-zinc-500">{eyebrow}</p>}
        <h1 className="truncate text-xl font-black tracking-tight text-white">{title}</h1>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
