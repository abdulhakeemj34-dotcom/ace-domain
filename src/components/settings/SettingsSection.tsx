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
    <section className="rounded-[30px] border border-white/10 bg-white/[0.06] p-4 shadow-glow">
      <div className="mb-4 flex items-start gap-3">
        {icon && (
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-[color:var(--ad-accent)]" style={{ backgroundColor: 'var(--ad-accent-soft)' }}>
            {icon}
          </div>
        )}
        <div className="min-w-0">
          {eyebrow && <p className="text-[10px] font-black uppercase tracking-[0.24em] text-frost/40">{eyebrow}</p>}
          <h2 className="text-lg font-black text-white">{title}</h2>
          {description && <p className="mt-1 text-sm leading-6 text-frost/55">{description}</p>}
        </div>
      </div>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}
