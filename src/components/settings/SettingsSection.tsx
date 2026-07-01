import type { ReactNode } from 'react';

type SettingsSectionProps = {
  children: ReactNode;
  description?: string;
  eyebrow?: string;
  icon?: ReactNode;
  title: string;
};

export function SettingsSection({ children, description, eyebrow, icon, title }: SettingsSectionProps) {
  return (
    <section className="rounded-[24px] border border-white/[0.08] bg-white/[0.035] p-3.5">
      <div className="mb-3 flex items-start gap-2.5">
        {icon && (
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-[color:var(--ad-accent)]" style={{ backgroundColor: 'var(--ad-accent-soft)' }}>
            {icon}
          </div>
        )}
        <div className="min-w-0">
          {eyebrow && <p className="text-[10px] font-black uppercase tracking-[0.24em] text-frost/40">{eyebrow}</p>}
          <h2 className="text-lg font-black text-white">{title}</h2>
          {description && <p className="mt-1 text-sm leading-5 text-frost/55">{description}</p>}
        </div>
      </div>
      <div className="grid gap-2.5">{children}</div>
    </section>
  );
}
