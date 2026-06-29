import type { Chat, ChatMessage, Community, MiniGamePreview, NotificationItem, Post, Story, TrendingConversation } from './types';

export const stories: Story[] = [
  { id: 's1', name: 'Maya', avatar: 'MA', location: 'Lagos', live: true },
  { id: 's2', name: 'Kenji', avatar: 'KN', location: 'Tokyo' },
  { id: 's3', name: 'Nora', avatar: 'NR', location: 'Oslo' },
  { id: 's4', name: 'Amir', avatar: 'AM', location: 'Dubai' },
  { id: 's5', name: 'Zoe', avatar: 'ZO', location: 'Toronto' }
];

export const posts: Post[] = [
  {
    id: 'p1',
    author: 'Leah Martins',
    handle: '@leahmoves',
    avatar: 'LM',
    region: 'Lisbon, Portugal',
    timestamp: '8 min',
    body: 'Looking for founders, musicians, and night-market people in Seoul this week. Drop your favorite hidden places.',
    interests: ['Travel', 'Startups', 'Music'],
    stats: { likes: '12.8K', comments: '418', shares: '86' }
  },
  {
    id: 'p2',
    author: 'Ade Cole',
    handle: '@adebuilds',
    avatar: 'AC',
    region: 'Lagos, Nigeria',
    timestamp: '22 min',
    body: 'New community idea: weekly global co-working rooms with skill swaps after each sprint. Who wants the first invite?',
    interests: ['Creators', 'Tech', 'Community'],
    stats: { likes: '8.4K', comments: '251', shares: '62' }
  },
  {
    id: 'p3',
    author: 'Sofia Chen',
    handle: '@sofiasky',
    avatar: 'SC',
    region: 'Singapore',
    timestamp: '41 min',
    body: 'The AI search here found three language exchange groups and a ramen club in under ten seconds. Dangerous power.',
    interests: ['Food', 'Language', 'AI'],
    stats: { likes: '6.1K', comments: '143', shares: '51' }
  }
];

export const chats: Chat[] = [
  { id: 'c1', name: 'Global Founders', avatar: 'GF', message: 'Priya: The Paris room starts in 10.', time: 'Now', unread: 5, kind: 'group' },
  { id: 'c2', name: 'Maya Johnson', avatar: 'MJ', message: 'Send me your favorite beach spot.', time: '3m', unread: 2, kind: 'direct' },
  { id: 'c3', name: 'Night Food Crew', avatar: 'NF', message: 'Ramen map is pinned.', time: '18m', unread: 0, kind: 'group' },
  { id: 'c4', name: 'Noah Park', avatar: 'NP', message: 'Matched from Seoul, say hi?', time: '1h', unread: 1, kind: 'direct' }
];

export const chatMessages: ChatMessage[] = [
  { id: 'm1', author: 'them', text: 'Welcome to the Global Founders room. People are joining from Paris, Lagos, and Seoul.', time: '8:14' },
  { id: 'm2', author: 'me', text: 'Perfect. I want to meet builders working on social apps and culture projects.', time: '8:15' },
  { id: 'm3', author: 'them', text: 'Tap the game button later too. We are testing casual rooms for quick icebreakers.', time: '8:16' }
];

export const communities: Community[] = [
  { id: 'co1', name: 'Gaming', members: '1.8M', accent: '#73FBD3', topic: 'Squads, tournaments, casual rooms' },
  { id: 'co2', name: 'Anime', members: '1.1M', accent: '#8B5CF6', topic: 'Watch parties, art, cosplay' },
  { id: 'co3', name: 'Music', members: '946K', accent: '#FF4ECD', topic: 'Artists, playlists, live sessions' },
  { id: 'co4', name: 'Football', members: '872K', accent: '#4DA3FF', topic: 'Clubs, match nights, debates' },
  { id: 'co5', name: 'Coding', members: '691K', accent: '#C0C7D8', topic: 'Builders, hack nights, careers' },
  { id: 'co6', name: 'Campus', members: '512K', accent: '#73FBD3', topic: 'School life and study circles' },
  { id: 'co7', name: 'Global', members: '2.4M', accent: '#8B5CF6', topic: 'Culture exchange and travel friends' }
];

export const notifications: NotificationItem[] = [
  { id: 'n1', title: 'New follower', body: 'Noah from Seoul followed your world profile.', time: '2m' },
  { id: 'n2', title: 'Message received', body: 'Maya sent a new beach recommendation.', time: '7m' },
  { id: 'n3', title: 'Post liked', body: '18 people liked your Lagos skyline story.', time: '18m' },
  { id: 'n4', title: 'Global Match ready', body: '7 people in Tokyo, Nairobi, and Berlin share your creator interests.', time: '31m' },
  { id: 'n5', title: 'Community invite', body: 'Gaming invited you to a late-night tournament room.', time: '1h' }
];

export const trendingConversations: TrendingConversation[] = [
  { id: 't1', title: 'Best street food cities', region: 'Global', pulse: '42K talking' },
  { id: 't2', title: 'Anime watch rooms tonight', region: 'Tokyo + Lagos', pulse: '18K live' },
  { id: 't3', title: 'Campus founders meetup', region: 'Worldwide', pulse: '9K matching' }
];

export const miniGamePreviews: MiniGamePreview[] = [
  { id: 'g1', name: 'World Trivia Clash', genre: 'Culture quiz', players: '12K waiting' },
  { id: 'g2', name: 'Emoji Speed Run', genre: 'Party game', players: '8K online' },
  { id: 'g3', name: 'Goal Rush', genre: 'Football arcade', players: '5K online' }
];

export const futureModules = [
  'mini-games',
  'marketplace',
  'food-ordering',
  'clothes-shopping',
  'ride-booking',
  'flights',
  'hotels',
  'wallet',
  'payments',
  'banking'
];
