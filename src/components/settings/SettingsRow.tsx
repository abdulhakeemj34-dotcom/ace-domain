import type { ReactNode } from 'react';

type SettingsRowProps = {
  children?: ReactNode;
  description?: string;
  icon?: ReactNode;
  label: string;
};

export function SettingsRow({ children, description, icon, label }: SettingsRowProps) {
  return (
    <div className="flex w-full items-center gap-3 rounded-[18px] border border-white/[0.06] bg-white/[0.03] p-3">
      {icon && <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white/10 text-frost/70">{icon}</div>}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-white">{label}</p>
        {description && <p className="mt-1 text-sm leading-5 text-frost/50">{description}</p>}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}
