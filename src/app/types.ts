export type AppScreen = 'welcome' | 'auth' | 'home' | 'chat' | 'chatRoom' | 'communities' | 'notifications' | 'profile';

export type Story = {
  id: string;
  name: string;
  avatar: string;
  location: string;
  live?: boolean;
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
};

export type ChatMessage = {
  id: string;
  author: 'me' | 'them';
  text: string;
  time: string;
};

export type Community = {
  id: string;
  name: string;
  members: string;
  accent: string;
  topic: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
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
};
