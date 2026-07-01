type AvatarProps = {
  label: string;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
};

const sizes = {
  sm: 'h-10 w-10 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-16 w-16 text-base'
};

export function Avatar({ label, size = 'md', active = false }: AvatarProps) {
  return (
    <div
      className={`${sizes[size]} relative grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-aurora via-signal to-plasma font-bold text-void shadow-[0_10px_24px_rgba(0,10,35,0.28)]`}
    >
      {label}
      {active && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-obsidian bg-aurora" />}
    </div>
  );
}
