import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
};

const variants = {
  primary: 'bg-white text-void shadow-glow hover:scale-[1.02]',
  secondary: 'border border-white/10 bg-white/10 text-white hover:bg-white/15',
  ghost: 'text-frost/70 hover:bg-white/10 hover:text-white'
};

export function Button({ children, className = '', variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-full px-5 py-3 text-sm font-semibold transition duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
