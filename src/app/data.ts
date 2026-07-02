import type {
  Chat,
  ChatMessage,
  Community,
  CommunityMember,
  CommunityPost,
  GlobalMatch,
  MiniGamePreview,
  NotificationItem,
  Post,
  Story,
  TrendingConversation
} from './types';

export const stories: Story[] = [
  { id: 's1', name: 'Maya', avatar: 'MA', location: 'Lagos', live: true, caption: 'Rooftop culture mixer: music, food, and new friends checking in.' },
  { id: 's2', name: 'Kenji', avatar: 'KN', location: 'Tokyo', caption: 'Late-night arcade run. The language-game room is meeting after.' },
  { id: 's3', name: 'Nora', avatar: 'NR', location: 'Oslo', caption: 'Snow walk, playlist swap, and a tiny creator circle.' },
  { id: 's4', name: 'Amir', avatar: 'AM', location: 'Dubai', caption: 'Future city meetup is live with founders and designers.' },
  { id: 's5', name: 'Zoe', avatar: 'ZO', location: 'Toronto', caption: 'Campus creators after class: study sprint first, food crawl later.' },
  { id: 's6', name: 'Diego', avatar: 'DS', location: 'Rio', caption: 'Beach football room is matching travelers and local players.' }
];

export const posts: Post[] = [
  {
    id: 'p1',
    author: 'Leah Martins',
    handle: '@leahmoves',
    avatar: 'LM',
    region: 'Lisbon, Portugal',
    timestamp: '8 min',
    context: 'Travel circle / Seoul this week',
    body: 'Landing in Seoul tonight. Looking for founders, musicians, and night-market people who know the hidden places tourists miss.',
    interests: ['Travel', 'Startups', 'Music'],
    replyPreview: 'Mina: Hongdae after 10PM, then the vinyl cafe near Hapjeong.',
    stats: { likes: '12.8K', comments: '418', shares: '86' }
  },
  {
    id: 'p2',
    author: 'Ade Cole',
    handle: '@adebuilds',
    avatar: 'AC',
    region: 'Lagos, Nigeria',
    timestamp: '22 min',
    context: 'Builder room / Product sprint',
    body: 'New community idea: weekly global co-working rooms with skill swaps after each sprint. Ship for 45 minutes, then trade one useful thing you learned.',
    interests: ['Creators', 'Tech', 'Community'],
    replyPreview: 'Zoe: Add a beginner table and I will bring campus creators.',
    stats: { likes: '8.4K', comments: '251', shares: '62' }
  },
  {
    id: 'p3',
    author: 'Sofia Chen',
    handle: '@sofiasky',
    avatar: 'SC',
    region: 'Singapore',
    timestamp: '41 min',
    context: 'Discovery test / Food + language',
    body: 'The AI search found three language exchange groups and a ramen club in under ten seconds. This is exactly how meeting the world should feel.',
    interests: ['Food', 'Language', 'AI'],
    replyPreview: 'Kenji: Send the ramen one. Tokyo room is ready.',
    stats: { likes: '6.1K', comments: '143', shares: '51' }
  },
  {
    id: 'p4',
    author: 'Mina Park',
    handle: '@minacodes',
    avatar: 'MP',
    region: 'Seoul, South Korea',
    timestamp: '1h',
    context: 'Mini-game lab / Language exchange',
    body: 'Testing a one-minute flag quiz for language rooms. It starts as a game, then somehow everyone is teaching slang from their city.',
    interests: ['Games', 'Language', 'Coding'],
    replyPreview: 'Noah: Add football badges and Brazil will take over.',
    stats: { likes: '4.9K', comments: '119', shares: '44' }
  },
  {
    id: 'p5',
    author: 'Aisha Noor',
    handle: '@aishahosts',
    avatar: 'AN',
    region: 'Nairobi, Kenya',
    timestamp: '2h',
    context: 'Culture dinner / Creator invites',
    body: 'Tonight’s prompt: bring one song, one street food, and one belief about your city that outsiders always misunderstand.',
    interests: ['Food', 'Creators', 'Culture'],
    replyPreview: 'Diego: Rio is showing up with funk, football, and beach stories.',
    stats: { likes: '9.7K', comments: '302', shares: '73' }
  }
];

export const chats: Chat[] = [
  { id: 'c1', name: 'Global Founders', avatar: 'GF', message: 'Priya: The Paris room starts in 10.', time: 'Now', unread: 5, kind: 'group', online: true, members: 28, avatars: ['PR', 'AC', 'SC'] },
  { id: 'c2', name: 'Maya Johnson', avatar: 'MJ', message: 'Send me your favorite beach spot.', time: '3m', unread: 2, kind: 'direct', online: true, country: 'Nigeria' },
  { id: 'c3', name: 'Night Food Crew', avatar: 'NF', message: 'Ramen map is pinned.', time: '18m', unread: 0, kind: 'group', online: true, members: 143, avatars: ['ZO', 'KN', 'NF'] },
  { id: 'c4', name: 'Noah Park', avatar: 'NP', message: 'Matched from Seoul, say hi?', time: '1h', unread: 1, kind: 'direct', online: false, country: 'South Korea' }
];

export const chatMessagesByChatId: Record<string, ChatMessage[]> = {
  c1: [
    { id: 'm1', author: 'them', authorName: 'Priya', text: 'Welcome to the Global Founders room. People are joining from Paris, Lagos, and Seoul.', time: '8:14' },
    { id: 'm2', author: 'me', text: 'Perfect. I want to meet builders working on social apps and culture projects.', time: '8:15' },
    { id: 'm3', author: 'them', authorName: 'Sofia', text: 'Tap the game button later too. We are testing casual rooms for quick icebreakers.', time: '8:16' }
  ],
  c2: [
    { id: 'm4', author: 'them', authorName: 'Maya', text: 'Send me your favorite beach spot. I am building a weekend map.', time: '9:03' },
    { id: 'm5', author: 'me', text: 'Tarkwa Bay at golden hour. Go with music and snacks.', time: '9:05' },
    { id: 'm6', author: 'them', authorName: 'Maya', text: 'Done. That sounds exactly like an Ace Domain meetup.', time: '9:06' }
  ],
  c3: [
    { id: 'm7', author: 'them', authorName: 'Kenji', text: 'Ramen map is pinned. Vote for the next city after Tokyo.', time: '10:20' },
    { id: 'm8', author: 'me', text: 'Lagos street food next. Suya, puff-puff, and late-night spots.', time: '10:21' },
    { id: 'm9', author: 'them', authorName: 'Zoe', text: 'That room would explode. I am in.', time: '10:22' }
  ],
  c4: [
    { id: 'm10', author: 'them', authorName: 'Noah', text: 'Matched from Seoul. I saw we both like coding and football.', time: '11:01' },
    { id: 'm11', author: 'me', text: 'Nice. What are you building right now?', time: '11:03' },
    { id: 'm12', author: 'them', authorName: 'Noah', text: 'A tiny game for language exchange rooms.', time: '11:05' }
  ]
};

export const communities: Community[] = [
  { id: 'co1', name: 'Gaming', members: '1.8M', accent: '#73FBD3', topic: 'Squads, tournaments, casual rooms', description: 'Find players, build squads, and jump into casual competitive rooms.', online: '84K online' },
  { id: 'co2', name: 'Anime', members: '1.1M', accent: '#8B5CF6', topic: 'Watch parties, art, cosplay', description: 'Watch rooms, fan art, cosplay drops, and debate corners.', online: '39K online' },
  { id: 'co3', name: 'Music', members: '946K', accent: '#FF4ECD', topic: 'Artists, playlists, live sessions', description: 'Discover global artists, trade playlists, and join listening rooms.', online: '51K online' },
  { id: 'co4', name: 'Football', members: '872K', accent: '#4DA3FF', topic: 'Clubs, match nights, debates', description: 'Matchday rooms, club debates, fantasy talk, and quick predictions.', online: '67K online' },
  { id: 'co5', name: 'Coding', members: '691K', accent: '#C0C7D8', topic: 'Builders, hack nights, careers', description: 'Build in public, find collaborators, and trade career advice.', online: '22K online' },
  { id: 'co6', name: 'Campus', members: '512K', accent: '#73FBD3', topic: 'School life and study circles', description: 'Campus life, study circles, events, and student creator rooms.', online: '18K online' },
  { id: 'co7', name: 'Global', members: '2.4M', accent: '#8B5CF6', topic: 'Culture exchange and travel friends', description: 'Meet people worldwide through culture, travel, and shared curiosity.', online: '120K online' }
];

export const notifications: NotificationItem[] = [
  { id: 'n1', title: 'New follower', body: 'Noah from Seoul followed your world profile.', time: '2m', category: 'social', unread: true },
  { id: 'n2', title: 'Message received', body: 'Maya sent a new beach recommendation.', time: '7m', category: 'message', unread: true },
  { id: 'n3', title: 'Post liked', body: '18 people liked your Lagos skyline story.', time: '18m', category: 'social', unread: false },
  { id: 'n4', title: 'Global Match ready', body: '7 people in Tokyo, Nairobi, and Berlin share your creator interests.', time: '31m', category: 'match', unread: true },
  { id: 'n5', title: 'Community invite', body: 'Gaming invited you to a late-night tournament room.', time: '1h', category: 'community', unread: false }
];

export const trendingConversations: TrendingConversation[] = [
  { id: 't1', title: 'Best street food cities', region: 'Global', pulse: '42K talking' },
  { id: 't2', title: 'Anime watch rooms tonight', region: 'Tokyo + Lagos', pulse: '18K live' },
  { id: 't3', title: 'Campus founders meetup', region: 'Worldwide', pulse: '9K matching' },
  { id: 't4', title: 'Language exchange icebreakers', region: 'Seoul + Nairobi', pulse: '6K joining' }
];

export const miniGamePreviews: MiniGamePreview[] = [
  { id: 'g1', name: 'Trivia Battle', genre: 'Culture quiz', players: '12K waiting', tagline: 'Challenge people on food, flags, music, and cities.', status: 'ready' },
  { id: 'g2', name: 'Word Rush', genre: 'Speed puzzle', players: '8K online', tagline: 'Fast word rounds for chat rooms and new matches.', status: 'ready' },
  { id: 'g3', name: 'Guess the Flag', genre: 'World quiz', players: '5K online', tagline: 'Learn countries with quick-fire global rounds.', status: 'ready' },
  { id: 'g4', name: 'Quick Duel', genre: 'Arcade versus', players: 'Soon', tagline: 'One-minute duels for instant friend energy.', status: 'soon' }
];

export const globalMatches: GlobalMatch[] = [
  { id: 'gm1', name: 'Mina Park', avatar: 'MP', country: 'South Korea', countryCode: 'KR', distance: 'Seoul', interests: ['Coding', 'Anime', 'Games'], vibe: 'Building a language game for travelers.' },
  { id: 'gm2', name: 'Diego Silva', avatar: 'DS', country: 'Brazil', countryCode: 'BR', distance: 'Rio', interests: ['Football', 'Music', 'Travel'], vibe: 'Knows every beach football spot.' },
  { id: 'gm3', name: 'Aisha Noor', avatar: 'AN', country: 'Kenya', countryCode: 'KE', distance: 'Nairobi', interests: ['Startups', 'Food', 'Creators'], vibe: 'Hosts creator dinners and pitch nights.' }
];

export const communityPosts: CommunityPost[] = [
  { id: 'cp1', communityId: 'co1', author: 'Game Night Planet', body: 'Quick Duel lobby opens Friday. Bring a duo or match randomly.', time: '12m', reactions: '9.8K' },
  { id: 'cp2', communityId: 'co1', author: 'Mina Park', body: 'Need two players for a culture trivia room tonight.', time: '28m', reactions: '2.1K' },
  { id: 'cp3', communityId: 'co2', author: 'Nora Lee', body: 'Anime watch room schedule is live for the weekend.', time: '16m', reactions: '4.7K' },
  { id: 'cp4', communityId: 'co3', author: 'Zoe Beats', body: 'Drop one song that explains your city.', time: '40m', reactions: '6.3K' },
  { id: 'cp5', communityId: 'co4', author: 'Diego Silva', body: 'Tonight: best young midfielders debate. Bring stats.', time: '21m', reactions: '5.5K' },
  { id: 'cp6', communityId: 'co5', author: 'Ade Cole', body: 'Shipping a mobile UI sprint room in one hour.', time: '8m', reactions: '3.2K' },
  { id: 'cp7', communityId: 'co6', author: 'Campus Live', body: 'Study sprint rooms are matching by timezone now.', time: '34m', reactions: '1.9K' },
  { id: 'cp8', communityId: 'co7', author: 'Ace Domain', body: 'Meet the World hour starts with culture prompts and quick intros.', time: 'Now', reactions: '18K' }
];

export const communityMembers: CommunityMember[] = [
  { id: 'cm1', communityId: 'co1', name: 'Mina', avatar: 'MP', role: 'Trivia host' },
  { id: 'cm2', communityId: 'co1', name: 'Noah', avatar: 'NP', role: 'Duel captain' },
  { id: 'cm3', communityId: 'co2', name: 'Kenji', avatar: 'KN', role: 'Watch lead' },
  { id: 'cm4', communityId: 'co3', name: 'Zoe', avatar: 'ZO', role: 'Playlist curator' },
  { id: 'cm5', communityId: 'co4', name: 'Diego', avatar: 'DS', role: 'Matchday voice' },
  { id: 'cm6', communityId: 'co5', name: 'Ade', avatar: 'AC', role: 'Builder mentor' },
  { id: 'cm7', communityId: 'co6', name: 'Maya', avatar: 'MA', role: 'Campus guide' },
  { id: 'cm8', communityId: 'co7', name: 'Aisha', avatar: 'AN', role: 'Global host' }
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
