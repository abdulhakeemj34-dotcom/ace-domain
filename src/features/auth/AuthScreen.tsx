import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { AceDomainIcon } from '../../components/logo/AceDomainIcon';
import { supabaseConfig, supabaseSetupMessage } from '../../lib/supabase';
import { loginWithEmail, signUpWithEmail } from '../../services/authService';

type AuthScreenProps = {
  onComplete: (mode: 'demo' | 'live') => void;
};

export function AuthScreen({ onComplete }: AuthScreenProps) {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [canUseDemoFallback, setCanUseDemoFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const backendReady = supabaseConfig.isConfigured;

  const continueDemo = () => {
    setCanUseDemoFallback(false);
    setError('');
    setStatus('Opening Ace Domain in demo mode.');
    onComplete('demo');
  };

  const submitAuth = async () => {
    if (isLoading) {
      return;
    }

    setError('');
    setStatus('');
    setCanUseDemoFallback(false);

    if (!backendReady) {
      continueDemo();
      return;
    }

    setIsLoading(true);

    try {
      const result =
        mode === 'signup'
          ? await signUpWithEmail({ displayName, email, password })
          : await loginWithEmail({ email, password });

      if (result.error) {
        setError(result.error);
        setCanUseDemoFallback(Boolean(result.canUseDemoFallback || result.setupRequired));

        if (result.canUseDemoFallback || result.setupRequired) {
          setStatus('You can keep exploring in demo mode without creating a live account.');
        }

        return;
      }

      if (result.needsEmailConfirmation) {
        setStatus('Account created. Check your email to confirm your Ace Domain login.');
        return;
      }

      setStatus(result.profileWarning || (mode === 'signup' ? 'Account created.' : 'Welcome back.'));
      onComplete('live');
    } catch {
      setError('Live authentication could not finish. You can continue in demo mode without creating a live account.');
      setStatus('Demo mode is still available.');
      setCanUseDemoFallback(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex min-h-[100dvh] flex-col overflow-y-auto bg-black px-5 pb-8 pt-16 text-white">
      <div className="mb-10 flex items-center gap-3">
        <AceDomainIcon size="sm" withGlow={false} />
        <div>
          <p className="text-sm font-black">Ace Domain</p>
          <p className="text-xs text-zinc-500">Meet the World</p>
        </div>
      </div>

      <div className="mb-8 min-w-0">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">Access</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">
          {mode === 'signup' ? 'Create your account.' : 'Log in.'}
        </h1>
        <p className="ad-safe-break mt-3 max-w-sm text-sm leading-6 text-zinc-400">
          Sign up with a display name and email. Log in with that email and password, or continue locally when live auth is unavailable.
        </p>
      </div>

      {!backendReady && (
        <p className="mb-4 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm leading-6 text-zinc-400">
          {supabaseSetupMessage} Local access is still available.
        </p>
      )}

      <div className="mb-5 grid grid-cols-2 rounded-full border border-white/10 p-1">
        {(['signup', 'login'] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setMode(item);
              setCanUseDemoFallback(false);
              setError('');
              setStatus('');
            }}
            className={`rounded-full py-3 text-sm font-bold capitalize transition ${
              mode === item ? 'bg-white text-black' : 'text-zinc-500'
            }`}
          >
            {item === 'signup' ? 'Sign up' : 'Login'}
          </button>
        ))}
      </div>

      <form
        className="grid gap-3"
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
            className="min-h-14 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 text-white outline-none placeholder:text-zinc-600"
            placeholder="Display name shown on profile"
          />
        )}
        {mode === 'login' && (
          <p className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm leading-6 text-zinc-400">
            Log in with your email address. Username login is not active yet.
          </p>
        )}
        <input
          required={backendReady}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-h-14 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 text-white outline-none placeholder:text-zinc-600"
          placeholder={mode === 'signup' ? 'Email address used for login' : 'Email address'}
        />
        <input
          required={backendReady}
          minLength={6}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="min-h-14 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 text-white outline-none placeholder:text-zinc-600"
          placeholder="Password"
        />

        {error && <p className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
        {status && <p className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">{status}</p>}

        <button
          type="submit"
          className="mt-2 flex min-h-14 items-center justify-center gap-2 rounded-full bg-white px-5 text-base font-black text-black disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : backendReady ? mode === 'signup' ? 'Create account' : 'Log in with email' : 'Continue in demo mode'}
          {!isLoading && <ArrowRight size={18} />}
        </button>

        {canUseDemoFallback && (
          <button
            type="button"
            className="min-h-14 rounded-full border border-white/15 px-5 text-base font-bold text-white"
            onClick={continueDemo}
          >
            Continue in demo mode
          </button>
        )}
      </form>

      <div className="mt-auto pt-8 text-center text-xs text-zinc-600">
        Social login comes later. This screen stays safe without exposing secrets.
      </div>
    </section>
  );
}
