import { notifications as mockNotifications } from '../app/data';
import type { NotificationItem } from '../app/types';
import { asString, getStoredSession, supabaseConfig, supabaseRestRequest } from '../lib/supabase';

type NotificationRow = {
  body?: string | null;
  created_at?: string | null;
  id: string;
  is_read?: boolean | null;
  title?: string | null;
  type?: string | null;
  user_id?: string | null;
};

type NotificationResult = {
  data: NotificationItem[];
  error?: string;
  usingFallback: boolean;
};

function categoryFromType(type?: string | null): NotificationItem['category'] {
  if (type === 'message' || type === 'match' || type === 'community') {
    return type;
  }

  return 'social';
}

function timeLabel(value?: string | null) {
  if (!value) {
    return 'Now';
  }

  const createdAt = new Date(value).getTime();

  if (!Number.isFinite(createdAt)) {
    return 'Now';
  }

  const minutes = Math.max(1, Math.round((Date.now() - createdAt) / 60000));

  if (minutes < 60) {
    return `${minutes}m`;
  }

  return `${Math.round(minutes / 60)}h`;
}

function mapNotification(row: NotificationRow): NotificationItem {
  return {
    body: asString(row.body),
    category: categoryFromType(row.type),
    id: row.id,
    time: timeLabel(row.created_at),
    title: asString(row.title, 'Notification'),
    unread: !row.is_read
  };
}

export async function getNotifications(): Promise<NotificationResult> {
  const session = getStoredSession();

  if (!supabaseConfig.isConfigured || !session) {
    return { data: mockNotifications, usingFallback: true };
  }

  try {
    const rows = await supabaseRestRequest<NotificationRow[]>('notifications', {
      query: `user_id=eq.${encodeURIComponent(session.user.id)}&select=id,user_id,type,title,body,is_read,created_at&order=created_at.desc&limit=50`
    });

    if (!Array.isArray(rows) || rows.length === 0) {
      return { data: mockNotifications, usingFallback: true };
    }

    return { data: rows.map(mapNotification), usingFallback: false };
  } catch {
    return {
      data: mockNotifications,
      error: 'Live notifications are unavailable. Showing local activity.',
      usingFallback: true
    };
  }
}

export async function setNotificationRead(notificationId: string, isRead: boolean) {
  const session = getStoredSession();

  if (!supabaseConfig.isConfigured || !session) {
    return { ok: false, usingFallback: true };
  }

  try {
    await supabaseRestRequest('notifications', {
      body: { is_read: isRead },
      method: 'PATCH',
      query: `id=eq.${encodeURIComponent(notificationId)}&user_id=eq.${encodeURIComponent(session.user.id)}`
    });
    return { ok: true, usingFallback: false };
  } catch {
    return { error: 'Notification state could not sync right now.', ok: false, usingFallback: true };
  }
}

export async function markAllNotificationsRead() {
  const session = getStoredSession();

  if (!supabaseConfig.isConfigured || !session) {
    return { ok: false, usingFallback: true };
  }

  try {
    await supabaseRestRequest('notifications', {
      body: { is_read: true },
      method: 'PATCH',
      query: `user_id=eq.${encodeURIComponent(session.user.id)}`
    });
    return { ok: true, usingFallback: false };
  } catch {
    return { error: 'Notification state could not sync right now.', ok: false, usingFallback: true };
  }
}
