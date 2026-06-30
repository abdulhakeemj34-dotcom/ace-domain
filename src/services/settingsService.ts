import { sanitizeAppSettings } from '../features/settings/settingsStorage';
import type { AppSettings } from '../features/settings/settingsTypes';
import { getStoredSession, supabaseConfig, supabaseRestRequest } from '../lib/supabase';

type UserSettingsRow = {
  settings: unknown;
  settings_version: number;
  updated_at: string;
  user_id: string;
};

type SettingsSyncResult = {
  data: AppSettings | null;
  error?: string;
  remoteExists: boolean;
  usingFallback: boolean;
};

function toSettingsJson(settings: AppSettings) {
  return JSON.parse(JSON.stringify(sanitizeAppSettings(settings))) as Record<string, unknown>;
}

export async function loadCurrentUserSettings(): Promise<SettingsSyncResult> {
  const session = getStoredSession();

  if (!supabaseConfig.isConfigured || !session) {
    return { data: null, remoteExists: false, usingFallback: true };
  }

  try {
    const rows = await supabaseRestRequest<UserSettingsRow[]>('user_settings', {
      accessToken: session.access_token,
      query: `user_id=eq.${encodeURIComponent(session.user.id)}&select=user_id,settings,settings_version,updated_at&limit=1`
    });
    const row = rows[0];

    if (!row) {
      return { data: null, remoteExists: false, usingFallback: false };
    }

    return {
      data: sanitizeAppSettings(row.settings),
      remoteExists: true,
      usingFallback: false
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Settings load failed.',
      remoteExists: false,
      usingFallback: true
    };
  }
}

export async function upsertCurrentUserSettings(settings: AppSettings): Promise<SettingsSyncResult> {
  const session = getStoredSession();

  if (!supabaseConfig.isConfigured || !session) {
    return { data: null, remoteExists: false, usingFallback: true };
  }

  const sanitizedSettings = sanitizeAppSettings(settings);

  try {
    const rows = await supabaseRestRequest<UserSettingsRow[]>('user_settings', {
      accessToken: session.access_token,
      body: {
        settings: toSettingsJson(sanitizedSettings),
        settings_version: 1,
        user_id: session.user.id
      },
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=representation',
      query: 'on_conflict=user_id&select=user_id,settings,settings_version,updated_at'
    });

    return {
      data: rows[0] ? sanitizeAppSettings(rows[0].settings) : sanitizedSettings,
      remoteExists: true,
      usingFallback: false
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Settings save failed.',
      remoteExists: false,
      usingFallback: true
    };
  }
}
