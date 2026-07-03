import { posts as mockPosts } from '../app/data';
import type { Post } from '../app/types';
import { asNumber, asString, isRecord, supabaseConfig, supabaseRestRequest } from '../lib/supabase';

type PostRow = {
  comments_count?: number | null;
  content?: string | null;
  created_at?: string | null;
  id: string;
  image_url?: string | null;
  likes_count?: number | null;
  profiles?: ProfileJoin | ProfileJoin[] | null;
  user_id?: string | null;
};

type ProfileJoin = {
  avatar_url?: string | null;
  country?: string | null;
  display_name?: string | null;
  username?: string | null;
};

type PostListResult = {
  data: Post[];
  error?: string;
  usingFallback: boolean;
};

function formatCount(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return String(value);
}

function timeAgo(value?: string | null) {
  if (!value) {
    return 'Now';
  }

  const createdAt = new Date(value).getTime();

  if (!Number.isFinite(createdAt)) {
    return 'Now';
  }

  const minutes = Math.max(1, Math.round((Date.now() - createdAt) / 60000));

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.round(minutes / 60);
  return `${hours}h`;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AD';
}

function firstProfile(profile: PostRow['profiles']) {
  if (Array.isArray(profile)) {
    return profile[0] ?? null;
  }

  return profile ?? null;
}

function mapPost(row: PostRow): Post {
  const profile = firstProfile(row.profiles);
  const author = asString(profile?.display_name) || asString(profile?.username) || 'Ace Domain User';
  const handle = asString(profile?.username);
  const body = asString(row.content, 'Shared a new world update.');

  return {
    author,
    avatar: initials(author),
    body,
    handle: handle ? `@${handle}` : '@acedomain',
    id: row.id,
    interests: ['Global', 'Community'],
    region: asString(profile?.country, 'Worldwide'),
    stats: {
      comments: formatCount(asNumber(row.comments_count)),
      likes: formatCount(asNumber(row.likes_count)),
      shares: '0'
    },
    timestamp: timeAgo(row.created_at)
  };
}

export async function getFeedPosts(): Promise<PostListResult> {
  if (!supabaseConfig.isConfigured) {
    return { data: mockPosts, usingFallback: true };
  }

  try {
    const rows = await supabaseRestRequest<PostRow[]>('posts', {
      query: 'select=id,user_id,content,image_url,likes_count,comments_count,created_at,profiles(display_name,username,avatar_url,country)&order=created_at.desc&limit=30'
    });

    if (!Array.isArray(rows) || rows.length === 0) {
      return { data: mockPosts, usingFallback: true };
    }

    return { data: rows.map(mapPost), usingFallback: false };
  } catch {
    return {
      data: mockPosts,
      error: 'Live feed is unavailable. Showing local demo feed.',
      usingFallback: true
    };
  }
}

export async function createPost(userId: string, content: string) {
  if (!supabaseConfig.isConfigured) {
    return { data: null, error: 'Supabase is not configured.', usingFallback: true };
  }

  try {
    const rows = await supabaseRestRequest<PostRow[]>('posts', {
      body: { content, user_id: userId },
      method: 'POST',
      prefer: 'return=representation'
    });

    const row = rows[0];
    return { data: row && isRecord(row) ? mapPost(row) : null, usingFallback: false };
  } catch {
    return { data: null, error: 'Post could not be created right now.', usingFallback: true };
  }
}
