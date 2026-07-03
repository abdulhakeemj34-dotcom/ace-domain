const SUPABASE_SESSION_KEY = 'ace-domain.supabase.session';
type AuthChangeEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED';
type AuthChangeListener = (event: AuthChangeEvent, session: SupabaseSession | null) => void;

const authListeners = new Set<AuthChangeListener>();

const envUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';
const placeholderValues = new Set(['', 'https://your-project-ref.supabase.co', 'your-public-anon-key']);

function isPlaceholder(value: string) {
  return placeholderValues.has(value);
}

function normalizeUrl(value: string) {
  if (isPlaceholder(value)) {
    return '';
  }

  try {
    return new URL(value).origin.replace(/\/$/, '');
  } catch {
    return '';
  }
}

const normalizedUrl = normalizeUrl(envUrl);
const hasUsableAnonKey = Boolean(envAnonKey && !isPlaceholder(envAnonKey));

export const supabaseConfig = {
  anonKey: envAnonKey,
  isConfigured: Boolean(normalizedUrl && hasUsableAnonKey),
  url: normalizedUrl
};

export const supabaseSetupMessage = 'Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env to enable the live backend.';

export type SupabaseUser = {
  aud?: string;
  email?: string;
  id: string;
  user_metadata?: Record<string, unknown>;
};

export type SupabaseSession = {
  access_token: string;
  expires_at?: number;
  expires_in?: number;
  refresh_token?: string;
  token_type?: string;
  user: SupabaseUser;
};

function notifyAuthListeners(event: AuthChangeEvent, session: SupabaseSession | null) {
  authListeners.forEach((listener) => {
    listener(event, session);
  });
}

export class SupabaseConfigError extends Error {
  constructor() {
    super(supabaseSetupMessage);
    this.name = 'SupabaseConfigError';
  }
}

export class SupabaseRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'SupabaseRequestError';
    this.status = status;
  }
}

type RequestBody = Record<string, unknown> | Array<Record<string, unknown>>;

type SupabaseRequestOptions = {
  accessToken?: string;
  body?: RequestBody;
  headers?: Record<string, string>;
  method?: 'DELETE' | 'GET' | 'PATCH' | 'POST';
  prefer?: string;
};

type SupabaseRestOptions = SupabaseRequestOptions & {
  query?: string;
};

function hasStorage() {
  try {
    return typeof window !== 'undefined' && Boolean(window.localStorage);
  } catch {
    return false;
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

export function asNumber(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

export function getStoredSession(): SupabaseSession | null {
  if (!hasStorage()) {
    return null;
  }

  const stored = window.localStorage.getItem(SUPABASE_SESSION_KEY);

  if (!stored) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(stored);
    const session = normalizeSession(parsed);

    if (!session) {
      window.localStorage.removeItem(SUPABASE_SESSION_KEY);
    }

    return session;
  } catch {
    window.localStorage.removeItem(SUPABASE_SESSION_KEY);
    return null;
  }
}

export function storeSession(session: SupabaseSession | null, event: AuthChangeEvent = session ? 'SIGNED_IN' : 'SIGNED_OUT') {
  if (!hasStorage()) {
    notifyAuthListeners(event, session);
    return;
  }

  if (!session) {
    window.localStorage.removeItem(SUPABASE_SESSION_KEY);
    notifyAuthListeners(event, null);
    return;
  }

  try {
    window.localStorage.setItem(SUPABASE_SESSION_KEY, JSON.stringify(session));
    notifyAuthListeners(event, session);
  } catch {
    // Storage can be unavailable on some locked-down webviews; auth will fall back safely.
    notifyAuthListeners(event, session);
  }
}

export function clearStoredSession() {
  storeSession(null);
}

export function subscribeToAuthChanges(listener: AuthChangeListener) {
  authListeners.add(listener);

  return () => {
    authListeners.delete(listener);
  };
}

export function normalizeSession(value: unknown): SupabaseSession | null {
  if (!isRecord(value)) {
    return null;
  }

  const sessionSource = isRecord(value.session) ? value.session : value;
  const userSource = isRecord(sessionSource.user) ? sessionSource.user : isRecord(value.user) ? value.user : null;
  const accessToken = asString(sessionSource.access_token);
  const userId = asString(userSource?.id);

  if (!accessToken || !userSource || !userId) {
    return null;
  }

  return {
    access_token: accessToken,
    expires_at: typeof sessionSource.expires_at === 'number' ? sessionSource.expires_at : undefined,
    expires_in: typeof sessionSource.expires_in === 'number' ? sessionSource.expires_in : undefined,
    refresh_token: asString(sessionSource.refresh_token) || undefined,
    token_type: asString(sessionSource.token_type) || undefined,
    user: {
      aud: asString(userSource.aud) || undefined,
      email: asString(userSource.email) || undefined,
      id: userId,
      user_metadata: isRecord(userSource.user_metadata) ? userSource.user_metadata : undefined
    }
  };
}

export function extractUser(value: unknown): SupabaseUser | null {
  const session = normalizeSession(value);

  if (session) {
    return session.user;
  }

  if (!isRecord(value) || !isRecord(value.user)) {
    return null;
  }

  const id = asString(value.user.id);

  if (!id) {
    return null;
  }

  return {
    aud: asString(value.user.aud) || undefined,
    email: asString(value.user.email) || undefined,
    id,
    user_metadata: isRecord(value.user.user_metadata) ? value.user.user_metadata : undefined
  };
}

async function parseResponse(response: Response) {
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function endpoint(path: string) {
  if (!supabaseConfig.isConfigured) {
    throw new SupabaseConfigError();
  }

  return `${supabaseConfig.url}${path}`;
}

export function realtimeEndpoint() {
  if (!supabaseConfig.isConfigured) {
    throw new SupabaseConfigError();
  }

  const realtimeUrl = supabaseConfig.url.replace(/^http/i, 'ws');
  return `${realtimeUrl}/realtime/v1/websocket?apikey=${encodeURIComponent(supabaseConfig.anonKey)}&vsn=1.0.0`;
}

export async function supabaseAuthRequest<T>(path: string, options: SupabaseRequestOptions = {}) {
  const response = await fetch(endpoint(`/auth/v1${path}`), {
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      apikey: supabaseConfig.anonKey,
      Authorization: `Bearer ${options.accessToken ?? supabaseConfig.anonKey}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    method: options.method ?? 'GET'
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    const message = isRecord(payload) ? asString(payload.msg || payload.message || payload.error_description || payload.error, response.statusText) : response.statusText;
    throw new SupabaseRequestError(message, response.status);
  }

  return payload as T;
}

export async function supabaseRestRequest<T>(table: string, options: SupabaseRestOptions = {}) {
  const query = options.query ? `?${options.query.replace(/^\?/, '')}` : '';
  const session = getStoredSession();
  const response = await fetch(endpoint(`/rest/v1/${table}${query}`), {
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      apikey: supabaseConfig.anonKey,
      Authorization: `Bearer ${options.accessToken ?? session?.access_token ?? supabaseConfig.anonKey}`,
      'Content-Type': 'application/json',
      ...(options.prefer ? { Prefer: options.prefer } : {}),
      ...(options.headers ?? {})
    },
    method: options.method ?? 'GET'
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    const message = isRecord(payload) ? asString(payload.message || payload.details || payload.hint, response.statusText) : response.statusText;
    throw new SupabaseRequestError(message, response.status);
  }

  return payload as T;
}

export const supabase = {
  auth: {
    clearSession: clearStoredSession,
    getStoredSession,
    onAuthStateChange: subscribeToAuthChanges,
    storeSession
  },
  config: supabaseConfig,
  request: {
    auth: supabaseAuthRequest,
    rest: supabaseRestRequest
  },
  realtimeEndpoint
};
