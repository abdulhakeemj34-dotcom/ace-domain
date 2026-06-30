import { communities as mockCommunities } from '../app/data';
import type { Community } from '../app/types';
import { asNumber, asString, getStoredSession, supabaseConfig, supabaseRestRequest } from '../lib/supabase';

type CommunityRow = {
  category?: string | null;
  description?: string | null;
  icon?: string | null;
  id: string;
  members_count?: number | null;
  name?: string | null;
  slug?: string | null;
};

type CommunityListResult = {
  data: Community[];
  error?: string;
  usingFallback: boolean;
};

const accentByCategory: Record<string, string> = {
  anime: '#8B5CF6',
  coding: '#C0C7D8',
  football: '#4DA3FF',
  gaming: '#73FBD3',
  global: '#8B5CF6',
  music: '#FF4ECD'
};

function formatMembers(value: number) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${Math.round(value / 1000)}K`;
  }

  return String(value);
}

function mapCommunity(row: CommunityRow): Community {
  const name = asString(row.name, 'Community');
  const category = asString(row.category, name).toLowerCase();
  const members = asNumber(row.members_count);

  return {
    accent: accentByCategory[category] ?? '#73FBD3',
    description: asString(row.description, 'A global Ace Domain community.'),
    id: row.id,
    members: formatMembers(members),
    name,
    online: members > 0 ? `${formatMembers(Math.max(1, Math.round(members * 0.04)))} online` : 'Live soon',
    topic: asString(row.category, 'Global community')
  };
}

export async function getCommunities(): Promise<CommunityListResult> {
  if (!supabaseConfig.isConfigured) {
    return { data: mockCommunities, usingFallback: true };
  }

  try {
    const rows = await supabaseRestRequest<CommunityRow[]>('communities', {
      query: 'select=id,name,slug,description,category,icon,members_count&order=members_count.desc'
    });

    if (!Array.isArray(rows) || rows.length === 0) {
      return { data: mockCommunities, usingFallback: true };
    }

    return { data: rows.map(mapCommunity), usingFallback: false };
  } catch (error) {
    return {
      data: mockCommunities,
      error: error instanceof Error ? error.message : 'Community load failed.',
      usingFallback: true
    };
  }
}

export async function joinCommunity(communityId: string) {
  const session = getStoredSession();

  if (!supabaseConfig.isConfigured || !session) {
    return { error: 'Live community membership needs Supabase auth.', ok: false, usingFallback: true };
  }

  try {
    await supabaseRestRequest('community_members', {
      body: { community_id: communityId, user_id: session.user.id },
      method: 'POST',
      prefer: 'resolution=ignore-duplicates'
    });
    return { ok: true, usingFallback: false };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Join failed.', ok: false, usingFallback: true };
  }
}

export async function leaveCommunity(communityId: string) {
  const session = getStoredSession();

  if (!supabaseConfig.isConfigured || !session) {
    return { error: 'Live community membership needs Supabase auth.', ok: false, usingFallback: true };
  }

  try {
    await supabaseRestRequest('community_members', {
      method: 'DELETE',
      query: `community_id=eq.${encodeURIComponent(communityId)}&user_id=eq.${encodeURIComponent(session.user.id)}`
    });
    return { ok: true, usingFallback: false };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Leave failed.', ok: false, usingFallback: true };
  }
}
