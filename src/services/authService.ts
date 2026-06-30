import {
  clearStoredSession,
  extractUser,
  getStoredSession,
  normalizeSession,
  storeSession,
  supabaseAuthRequest,
  supabaseConfig,
  supabaseSetupMessage,
  type SupabaseSession,
  type SupabaseUser
} from '../lib/supabase';
import { createProfileIfNeeded, getCurrentProfile } from './profileService';

type AuthCredentials = {
  displayName?: string;
  email: string;
  password: string;
};

type AuthResult = {
  error?: string;
  needsEmailConfirmation?: boolean;
  session: SupabaseSession | null;
  setupRequired?: boolean;
  user: SupabaseUser | null;
};

function setupRequiredResult(): AuthResult {
  return {
    error: supabaseSetupMessage,
    session: null,
    setupRequired: true,
    user: null
  };
}

function usernameFromEmail(email: string, userId?: string) {
  const base = email.split('@')[0]?.toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 18) || 'ace_user';
  const suffix = userId ? `_${userId.replace(/-/g, '').slice(0, 6)}` : '';
  return `${base}${suffix}`.slice(0, 24);
}

export async function signUpWithEmail({ displayName, email, password }: AuthCredentials): Promise<AuthResult> {
  if (!supabaseConfig.isConfigured) {
    return setupRequiredResult();
  }

  try {
    const payload = await supabaseAuthRequest<unknown>('/signup', {
      body: {
        data: {
          display_name: displayName,
          username: usernameFromEmail(email)
        },
        email,
        password
      },
      method: 'POST'
    });
    const session = normalizeSession(payload);
    const user = session?.user ?? extractUser(payload);

    if (session) {
      storeSession(session);
    }

    if (user && session) {
      await createProfileIfNeeded(
        {
          displayName: displayName || user.email || 'Ace Explorer',
          id: user.id,
          interests: ['Gaming', 'Music', 'Coding'],
          username: usernameFromEmail(email, user.id)
        },
        session.access_token
      );
    }

    return {
      needsEmailConfirmation: Boolean(user && !session),
      session,
      user
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Sign up failed.',
      session: null,
      user: null
    };
  }
}

export async function loginWithEmail({ email, password }: AuthCredentials): Promise<AuthResult> {
  if (!supabaseConfig.isConfigured) {
    return setupRequiredResult();
  }

  try {
    const payload = await supabaseAuthRequest<unknown>('/token?grant_type=password', {
      body: { email, password },
      method: 'POST'
    });
    const session = normalizeSession(payload);

    if (!session) {
      return { error: 'Supabase did not return a session.', session: null, user: null };
    }

    storeSession(session);
    const profile = await getCurrentProfile();

    if (!profile.data && !profile.error) {
      await createProfileIfNeeded(
        {
          displayName: session.user.email || 'Ace Explorer',
          id: session.user.id,
          interests: ['Gaming', 'Music', 'Coding'],
          username: usernameFromEmail(email, session.user.id)
        },
        session.access_token
      );
    }

    return { session, user: session.user };
  } catch (error) {
    clearStoredSession();
    return {
      error: error instanceof Error ? error.message : 'Login failed.',
      session: null,
      user: null
    };
  }
}

export async function getCurrentSession() {
  const session = getStoredSession();

  if (!supabaseConfig.isConfigured || !session) {
    return null;
  }

  try {
    await supabaseAuthRequest<unknown>('/user', {
      accessToken: session.access_token
    });
    return session;
  } catch {
    clearStoredSession();
    return null;
  }
}

export async function logout() {
  const session = getStoredSession();

  if (supabaseConfig.isConfigured && session) {
    try {
      await supabaseAuthRequest<unknown>('/logout', {
        accessToken: session.access_token,
        method: 'POST'
      });
    } catch {
      // Local session cleanup is still the important fallback for mobile readiness.
    }
  }

  clearStoredSession();
}
