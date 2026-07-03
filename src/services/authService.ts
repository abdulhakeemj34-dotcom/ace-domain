import {
  clearStoredSession,
  extractUser,
  getStoredSession,
  normalizeSession,
  storeSession,
  supabaseAuthRequest,
  supabaseConfig,
  SupabaseRequestError,
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
  canUseDemoFallback?: boolean;
  error?: string;
  needsEmailConfirmation?: boolean;
  profileWarning?: string;
  session: SupabaseSession | null;
  setupRequired?: boolean;
  user: SupabaseUser | null;
};

const authRateLimitMessage = 'Email signup is temporarily limited. Please try again later or continue in demo mode.';
const sessionRefreshBufferSeconds = 90;

function setupRequiredResult(): AuthResult {
  return {
    canUseDemoFallback: true,
    error: supabaseSetupMessage,
    session: null,
    setupRequired: true,
    user: null
  };
}

function isRateLimitError(error: unknown, message: string) {
  const normalizedMessage = message.toLowerCase();

  return (
    error instanceof SupabaseRequestError && error.status === 429
  ) || (
    normalizedMessage.includes('rate limit') ||
    normalizedMessage.includes('rate-limit') ||
    normalizedMessage.includes('too many requests') ||
    normalizedMessage.includes('email signup is disabled') ||
    normalizedMessage.includes('email rate limit')
  );
}

function isNetworkFailure(error: unknown, message: string) {
  const normalizedMessage = message.toLowerCase();

  return (
    error instanceof TypeError ||
    normalizedMessage.includes('failed to fetch') ||
    normalizedMessage.includes('networkerror') ||
    normalizedMessage.includes('network error') ||
    normalizedMessage.includes('load failed')
  );
}

function isInvalidLoginError(message: string) {
  const normalizedMessage = message.toLowerCase();

  return (
    normalizedMessage.includes('invalid login credentials') ||
    normalizedMessage.includes('invalid credentials') ||
    normalizedMessage.includes('invalid email or password')
  );
}

function isEmailConfirmationError(message: string) {
  const normalizedMessage = message.toLowerCase();

  return (
    normalizedMessage.includes('email not confirmed') ||
    normalizedMessage.includes('email confirmation') ||
    normalizedMessage.includes('confirm your email')
  );
}

function isExistingAccountError(message: string) {
  const normalizedMessage = message.toLowerCase();

  return (
    normalizedMessage.includes('already registered') ||
    normalizedMessage.includes('already exists') ||
    normalizedMessage.includes('user already')
  );
}

function authErrorResult(error: unknown, fallback: string): AuthResult {
  const message = error instanceof Error ? error.message : fallback;
  const isRateLimited = isRateLimitError(error, message);
  const networkFailure = isNetworkFailure(error, message);
  const invalidLogin = isInvalidLoginError(message);
  const emailConfirmation = isEmailConfirmationError(message);
  const existingAccount = isExistingAccountError(message);

  return {
    canUseDemoFallback: networkFailure || isRateLimited || invalidLogin || emailConfirmation || existingAccount,
    error: isRateLimited
      ? authRateLimitMessage
      : networkFailure
      ? 'Live authentication is unavailable right now. Check your connection or continue in demo mode.'
      : invalidLogin
      ? 'Email or password is incorrect. Use the email address you signed up with, or continue in demo mode.'
      : emailConfirmation
      ? 'Check your email to confirm your account before logging in. You can still continue in demo mode for now.'
      : existingAccount
      ? 'An account already exists for this email. Log in with your email and password, or continue in demo mode.'
      : message,
    session: null,
    user: null
  };
}

function usernameFromEmail(email: string, userId?: string) {
  const base = email.split('@')[0]?.toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 18) || 'ace_user';
  const suffix = userId ? `_${userId.replace(/-/g, '').slice(0, 6)}` : '';
  return `${base}${suffix}`.slice(0, 24);
}

function sessionNeedsRefresh(session: SupabaseSession) {
  if (typeof session.expires_at !== 'number') {
    return false;
  }

  return session.expires_at <= Math.floor(Date.now() / 1000) + sessionRefreshBufferSeconds;
}

async function refreshStoredSession(session: SupabaseSession) {
  if (!session.refresh_token) {
    return null;
  }

  try {
    const payload = await supabaseAuthRequest<unknown>('/token?grant_type=refresh_token', {
      body: { refresh_token: session.refresh_token },
      method: 'POST'
    });
    const refreshedSession = normalizeSession(payload);

    if (!refreshedSession) {
      return null;
    }

    storeSession(refreshedSession, 'TOKEN_REFRESHED');
    return refreshedSession;
  } catch {
    return null;
  }
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

    let profileWarning = '';

    if (user && session) {
      const profileResult = await createProfileIfNeeded(
        {
          displayName: displayName || user.email || 'Ace Explorer',
          id: user.id,
          interests: ['Gaming', 'Music', 'Coding'],
          username: usernameFromEmail(email, user.id)
        },
        session.access_token
      );

      if (profileResult.error) {
        profileWarning = 'Account access worked, but profile sync is waiting on Supabase.';
      }
    }

    return {
      needsEmailConfirmation: Boolean(user && !session),
      profileWarning,
      session,
      user
    };
  } catch (error) {
    return authErrorResult(error, 'Sign up failed.');
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
      return {
        canUseDemoFallback: true,
        error: 'Login did not return a session. Check your email to confirm your account before logging in.',
        session: null,
        user: null
      };
    }

    storeSession(session);
    const profile = await getCurrentProfile();

    let profileWarning = '';

    if (!profile.data) {
      const profileResult = await createProfileIfNeeded(
        {
          displayName: session.user.email || 'Ace Explorer',
          id: session.user.id,
          interests: ['Gaming', 'Music', 'Coding'],
          username: usernameFromEmail(email, session.user.id)
        },
        session.access_token
      );

      if (profile.error || profileResult.error) {
        profileWarning = 'Login worked, but profile sync is waiting on Supabase.';
      }
    }

    return { profileWarning, session, user: session.user };
  } catch (error) {
    clearStoredSession();
    return authErrorResult(error, 'Login failed.');
  }
}

export async function getCurrentSession() {
  const session = getStoredSession();

  if (!supabaseConfig.isConfigured || !session) {
    return null;
  }

  if (sessionNeedsRefresh(session)) {
    const refreshedSession = await refreshStoredSession(session);

    if (refreshedSession) {
      return refreshedSession;
    }
  }

  try {
    await supabaseAuthRequest<unknown>('/user', {
      accessToken: session.access_token
    });
    return session;
  } catch (error) {
    const refreshedSession = await refreshStoredSession(session);

    if (refreshedSession) {
      return refreshedSession;
    }

    if (isNetworkFailure(error, error instanceof Error ? error.message : '')) {
      return session;
    }

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
