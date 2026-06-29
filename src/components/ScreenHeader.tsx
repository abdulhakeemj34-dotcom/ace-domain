import type { ReactNode } from 'react';

type ScreenHeaderProps = {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
};

export function ScreenHeader({ eyebrow, title, action }: ScreenHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 px-5 pb-3 pt-8">
      <div>
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.28em] text-aurora/80">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">{title}</h1>
      </div>
      {action}
    </header>
  );
}
