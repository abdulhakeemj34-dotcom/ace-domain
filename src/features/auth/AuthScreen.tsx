import { useState } from 'react';
import { Button } from '../../components/Button';

type AuthScreenProps = {
  onComplete: () => void;
};

export function AuthScreen({ onComplete }: AuthScreenProps) {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');

  return (
    <section className="flex min-h-screen flex-col justify-end px-5 pb-8 pt-20">
      <div className="glass-panel rounded-[32px] p-5 animate-rise">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-aurora">Secure Access</p>
        <h1 className="mt-2 text-3xl font-black text-white">{mode === 'signup' ? 'Create your world ID' : 'Welcome back'}</h1>
        <p className="mt-2 text-sm leading-6 text-frost/65">
          Version 1 account flow for profiles, posts, communities, chats, and notifications.
        </p>

        <div className="mt-5 grid grid-cols-2 rounded-full bg-white/[0.06] p-1">
          {(['signup', 'login'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={`rounded-full py-3 text-sm font-semibold capitalize transition ${
                mode === item ? 'bg-white text-void' : 'text-frost/60'
              }`}
            >
              {item === 'signup' ? 'Sign Up' : 'Login'}
            </button>
          ))}
        </div>

        <form
          className="mt-5 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            onComplete();
          }}
        >
          {mode === 'signup' && (
            <input
              required
              className="w-full rounded-3xl border border-white/10 bg-white/[0.07] px-4 py-4 text-white outline-none placeholder:text-frost/35"
              placeholder="Display name"
            />
          )}
          <input
            required
            type="email"
            className="w-full rounded-3xl border border-white/10 bg-white/[0.07] px-4 py-4 text-white outline-none placeholder:text-frost/35"
            placeholder="Email address"
          />
          <input
            required
            minLength={6}
            type="password"
            className="w-full rounded-3xl border border-white/10 bg-white/[0.07] px-4 py-4 text-white outline-none placeholder:text-frost/35"
            placeholder="Password"
          />
          <Button type="submit" className="w-full py-4">
            {mode === 'signup' ? 'Create Account' : 'Login'}
          </Button>
        </form>
        <div className="mt-5">
          <div className="flex items-center gap-3 text-xs text-frost/35">
            <span className="h-px flex-1 bg-white/10" />
            Social login UI
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {['Google', 'Apple', 'Discord'].map((provider) => (
              <button key={provider} type="button" className="rounded-2xl border border-white/10 bg-white/[0.06] py-3 text-xs font-bold text-frost/70">
                {provider}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
