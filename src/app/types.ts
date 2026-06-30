export type AppScreen =
  | 'welcome'
  | 'auth'
  | 'home'
  | 'chat'
  | 'chatRoom'
  | 'communities'
  | 'notifications'
  | 'profile'
  | 'global'
  | 'calendar'
  | 'settings'
  | 'settingsCenter';

export type Story = {
  id: string;
  name: string;
  avatar: string;
  location: string;
  live?: boolean;
  caption?: string;
};

export type Post = {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  region: string;
  timestamp: string;
  body: string;
  interests: string[];
  stats: {
    likes: string;
    comments: string;
    shares: string;
  };
};

export type Chat = {
  id: string;
  name: string;
  avatar: string;
  message: string;
  time: string;
  unread: number;
  kind: 'direct' | 'group';
  online?: boolean;
  members?: number;
  avatars?: string[];
  country?: string;
};

export type ChatMessage = {
  id: string;
  author: 'me' | 'them';
  authorName?: string;
  text: string;
  time: string;
};

export type Community = {
  id: string;
  name: string;
  members: string;
  accent: string;
  topic: string;
  description?: string;
  online?: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  category: 'social' | 'message' | 'match' | 'community';
  unread: boolean;
};

export type TrendingConversation = {
  id: string;
  title: string;
  region: string;
  pulse: string;
};

export type MiniGamePreview = {
  id: string;
  name: string;
  genre: string;
  players: string;
  tagline: string;
  status: 'ready' | 'soon';
};

export type GlobalMatch = {
  id: string;
  name: string;
  avatar: string;
  country: string;
  countryCode: string;
  distance: string;
  interests: string[];
  vibe: string;
};

export type CommunityPost = {
  id: string;
  communityId: string;
  author: string;
  body: string;
  time: string;
  reactions: string;
};

export type CommunityMember = {
  id: string;
  communityId: string;
  name: string;
  avatar: string;
  role: string;
};
