import { useState } from 'react';
import { Button } from '../../components/Button';
import { supabaseConfig, supabaseSetupMessage } from '../../lib/supabase';
import { loginWithEmail, signUpWithEmail } from '../../services/authService';

type AuthScreenProps = {
  onComplete: () => void;
};

export function AuthScreen({ onComplete }: AuthScreenProps) {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const backendReady = supabaseConfig.isConfigured;

  const submitAuth = async () => {
    setError('');
    setStatus('');

    if (!backendReady) {
      setStatus('Supabase keys are missing, so Ace Domain is continuing in demo mode.');
      onComplete();
      return;
    }

    setIsLoading(true);

    const result =
      mode === 'signup'
        ? await signUpWithEmail({ displayName, email, password })
        : await loginWithEmail({ email, password });

    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.needsEmailConfirmation) {
      setStatus('Account created. Check your email to confirm your Ace Domain login.');
      return;
    }

    setStatus(mode === 'signup' ? 'World ID created.' : 'Welcome back.');
    onComplete();
  };

  return (
    <section className="flex min-h-screen flex-col justify-end px-5 pb-8 pt-20">
      <div className="glass-panel rounded-[32px] p-5 animate-rise">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-aurora">Secure Access</p>
        <h1 className="mt-2 text-3xl font-black text-white">{mode === 'signup' ? 'Create your world ID' : 'Welcome back'}</h1>
        <p className="mt-2 text-sm leading-6 text-frost/65">
          Version 1 account flow for profiles, posts, communities, chats, and notifications.
        </p>

        {!backendReady && (
          <p className="mt-4 rounded-3xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm leading-6 text-gold">
            {supabaseSetupMessage} This screen can still open the demo app without a live backend.
          </p>
        )}

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
            void submitAuth();
          }}
        >
          {mode === 'signup' && (
            <input
              required={backendReady}
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="w-full rounded-3xl border border-white/10 bg-white/[0.07] px-4 py-4 text-white outline-none placeholder:text-frost/35"
              placeholder="Display name"
            />
          )}
          <input
            required={backendReady}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-3xl border border-white/10 bg-white/[0.07] px-4 py-4 text-white outline-none placeholder:text-frost/35"
            placeholder="Email address"
          />
          <input
            required={backendReady}
            minLength={6}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-3xl border border-white/10 bg-white/[0.07] px-4 py-4 text-white outline-none placeholder:text-frost/35"
            placeholder="Password"
          />
          {error && <p className="rounded-3xl border border-plasma/25 bg-plasma/10 px-4 py-3 text-sm text-plasma">{error}</p>}
          {status && <p className="rounded-3xl border border-aurora/20 bg-aurora/10 px-4 py-3 text-sm text-aurora">{status}</p>}
          <Button type="submit" className="w-full py-4" disabled={isLoading}>
            {isLoading ? 'Connecting...' : backendReady ? mode === 'signup' ? 'Create Account' : 'Login' : 'Continue Demo'}
          </Button>
        </form>
        <div className="mt-5">
          <div className="flex items-center gap-3 text-xs text-frost/35">
            <span className="h-px flex-1 bg-white/10" />
            Social login
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {['Google', 'Apple', 'Discord'].map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={() => setStatus(`${provider} sign-in is not connected yet. Use email login or demo access for now.`)}
                className="rounded-2xl border border-white/10 bg-white/[0.06] py-3 text-xs font-bold text-frost/70"
              >
                {provider}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
