import type { ReactNode } from 'react';

type MobileAppShellProps = {
  children: ReactNode;
};

export function MobileAppShell({ children }: MobileAppShellProps) {
  return <div className="mx-auto min-h-screen w-full max-w-md">{children}</div>;
}
