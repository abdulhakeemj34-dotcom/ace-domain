import type { ReactNode } from 'react';

type ScreenHeaderProps = {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
};

export function ScreenHeader({ eyebrow, title, action }: ScreenHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3 px-4 pb-2 pt-6">
      <div className="min-w-0">
        {eyebrow && <p className="truncate text-[11px] font-semibold uppercase tracking-[0.24em] text-aurora/80">{eyebrow}</p>}
        <h1 className="mt-0.5 truncate text-[1.45rem] font-bold tracking-tight text-white">{title}</h1>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
