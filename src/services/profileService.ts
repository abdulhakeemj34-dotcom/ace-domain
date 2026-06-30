import { asString, asStringArray, getStoredSession, supabaseConfig, supabaseRestRequest } from '../lib/supabase';

export type BackendProfile = {
  avatar_url: string | null;
  bio: string | null;
  country: string | null;
  display_name: string | null;
  id: string;
  interests: string[] | null;
  username: string | null;
};

export type ProfileInput = {
  avatarUrl?: string;
  bio?: string;
  country?: string;
  displayName?: string;
  id: string;
  interests?: string[];
  username?: string;
};

type ProfileResult = {
  data: BackendProfile | null;
  error?: string;
  usingFallback: boolean;
};

function normalizeProfile(row: BackendProfile): BackendProfile {
  return {
    avatar_url: row.avatar_url ?? null,
    bio: row.bio ?? null,
    country: row.country ?? null,
    display_name: row.display_name ?? null,
    id: row.id,
    interests: asStringArray(row.interests),
    username: row.username ?? null
  };
}

function toProfilePayload(profile: ProfileInput) {
  return {
    avatar_url: profile.avatarUrl ?? null,
    bio: profile.bio ?? null,
    country: profile.country ?? null,
    display_name: profile.displayName ?? null,
    id: profile.id,
    interests: profile.interests ?? [],
    username: profile.username ?? null
  };
}

export async function createProfileIfNeeded(profile: ProfileInput, accessToken?: string): Promise<ProfileResult> {
  if (!supabaseConfig.isConfigured) {
    return { data: null, usingFallback: true };
  }

  try {
    const rows = await supabaseRestRequest<BackendProfile[]>('profiles', {
      accessToken,
      body: toProfilePayload(profile),
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=representation',
      query: 'on_conflict=id&select=*'
    });

    return { data: rows[0] ? normalizeProfile(rows[0]) : null, usingFallback: false };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Profile creation failed.', usingFallback: true };
  }
}

export async function getCurrentProfile(): Promise<ProfileResult> {
  const session = getStoredSession();

  if (!supabaseConfig.isConfigured || !session) {
    return { data: null, usingFallback: true };
  }

  try {
    const rows = await supabaseRestRequest<BackendProfile[]>('profiles', {
      query: `id=eq.${encodeURIComponent(session.user.id)}&select=*`
    });

    return { data: rows[0] ? normalizeProfile(rows[0]) : null, usingFallback: false };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Profile load failed.', usingFallback: true };
  }
}

export async function updateCurrentProfile(profile: Omit<ProfileInput, 'id'>): Promise<ProfileResult> {
  const session = getStoredSession();

  if (!supabaseConfig.isConfigured || !session) {
    return { data: null, usingFallback: true };
  }

  try {
    const rows = await supabaseRestRequest<BackendProfile[]>('profiles', {
      body: {
        avatar_url: profile.avatarUrl ?? null,
        bio: profile.bio ?? null,
        country: profile.country ?? null,
        display_name: profile.displayName ?? null,
        interests: profile.interests ?? [],
        username: profile.username ?? null
      },
      method: 'PATCH',
      prefer: 'return=representation',
      query: `id=eq.${encodeURIComponent(session.user.id)}&select=*`
    });

    if (!rows[0]) {
      return createProfileIfNeeded(
        {
          avatarUrl: profile.avatarUrl,
          bio: profile.bio,
          country: profile.country,
          displayName: profile.displayName,
          id: session.user.id,
          interests: profile.interests,
          username: profile.username
        },
        session.access_token
      );
    }

    return { data: normalizeProfile(rows[0]), usingFallback: false };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Profile update failed.', usingFallback: true };
  }
}

export function profileDisplayName(profile: BackendProfile) {
  return asString(profile.display_name) || asString(profile.username) || 'Ace Explorer';
}
