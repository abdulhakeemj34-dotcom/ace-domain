import { communities, globalMatches, miniGamePreviews, posts } from '../app/data';
import type {
  CountryProfile,
  CultureFact,
  GlobalEvent,
  GlobalFocus,
  GlobalOnboardingProfile,
  GlobalPerson,
  GlobalSafetySettings,
  SmartSearchResult
} from '../types/global';

export const languageOptions = [
  'English',
  'Yoruba',
  'Spanish',
  'Japanese',
  'Korean',
  'Portuguese',
  'Hindi',
  'French',
  'German',
  'Zulu'
];

export const focusOptions: GlobalFocus[] = ['Global friends', 'Gaming', 'Campus', 'Culture', 'Communities'];

export const defaultGlobalProfile: GlobalOnboardingProfile = {
  appLanguage: 'English',
  country: 'Nigeria',
  focus: 'Global friends',
  interests: ['Gaming', 'Music', 'Coding', 'Culture'],
  languagesLearning: ['Spanish', 'Japanese'],
  languagesSpoken: ['English', 'Yoruba'],
  region: 'West Africa'
};

export const defaultGlobalSettings: GlobalSafetySettings = {
  biggerText: false,
  clearerLabels: true,
  highContrast: false,
  hideCountry: false,
  hideLanguages: false,
  hideLocalTime: false,
  hideOnlineStatus: false,
  lowDataMode: false,
  messageRequests: true,
  reducedMotion: false,
  whoCanMessage: 'Friends of friends'
};

export const countryProfiles: CountryProfile[] = [
  {
    code: 'NG',
    funFact: 'Lagos has one of the most energetic music and creator scenes in Africa.',
    greeting: 'A warm hello and asking how someone is doing goes a long way.',
    id: 'nigeria',
    languages: ['English', 'Yoruba'],
    localTrends: ['Afrobeats rooms', 'Tech meetups', 'Campus creators'],
    name: 'Nigeria',
    peopleCount: '2.8M explorers',
    popularCommunities: ['Music', 'Coding', 'Football'],
    popularInterests: ['Afrobeats', 'Startups', 'Football'],
    region: 'West Africa',
    timeZone: 'Africa/Lagos'
  },
  {
    code: 'US',
    funFact: 'Campus clubs and local creator meetups are strong ways to discover new friends.',
    greeting: 'Quick, friendly intros are common, then people usually move into shared interests.',
    id: 'united-states',
    languages: ['English', 'Spanish'],
    localTrends: ['Campus esports', 'Creator rooms', 'Startup chats'],
    name: 'United States',
    peopleCount: '5.1M explorers',
    popularCommunities: ['Campus', 'Gaming', 'Coding'],
    popularInterests: ['Games', 'Startups', 'Movies'],
    region: 'North America',
    timeZone: 'America/New_York'
  },
  {
    code: 'UK',
    funFact: 'Football debates, music scenes, and student societies drive a lot of social energy.',
    greeting: 'A polite opening and a bit of humor usually lands well.',
    id: 'united-kingdom',
    languages: ['English'],
    localTrends: ['Football watch rooms', 'Music drops', 'Study circles'],
    name: 'United Kingdom',
    peopleCount: '1.6M explorers',
    popularCommunities: ['Football', 'Music', 'Campus'],
    popularInterests: ['Football', 'Music', 'Culture'],
    region: 'Europe',
    timeZone: 'Europe/London'
  },
  {
    code: 'JP',
    funFact: 'Small shared-interest groups around games, food, anime, and language exchange are very popular.',
    greeting: 'Respectful intros and clear context help start comfortable conversations.',
    id: 'japan',
    languages: ['Japanese', 'English'],
    localTrends: ['Arcade nights', 'Anime watch rooms', 'Ramen maps'],
    name: 'Japan',
    peopleCount: '2.2M explorers',
    popularCommunities: ['Anime', 'Gaming', 'Food'],
    popularInterests: ['Anime', 'Games', 'Food'],
    region: 'East Asia',
    timeZone: 'Asia/Tokyo'
  },
  {
    code: 'KR',
    funFact: 'Cafe culture, esports, music, and language exchange make strong social starting points.',
    greeting: 'Start with shared interests, then ask about favorite local spots or music.',
    id: 'south-korea',
    languages: ['Korean', 'English'],
    localTrends: ['Esports rooms', 'K-pop chats', 'Cafe guides'],
    name: 'South Korea',
    peopleCount: '1.9M explorers',
    popularCommunities: ['Gaming', 'Music', 'Anime'],
    popularInterests: ['Esports', 'Music', 'Coding'],
    region: 'East Asia',
    timeZone: 'Asia/Seoul'
  },
  {
    code: 'BR',
    funFact: 'Music, football, beach culture, and local festivals are easy conversation starters.',
    greeting: 'Friendly energy is welcome, especially when tied to music, sport, or food.',
    id: 'brazil',
    languages: ['Portuguese', 'English'],
    localTrends: ['Football nights', 'Music circles', 'Beach meetups'],
    name: 'Brazil',
    peopleCount: '2.4M explorers',
    popularCommunities: ['Football', 'Music', 'Travel'],
    popularInterests: ['Football', 'Music', 'Travel'],
    region: 'South America',
    timeZone: 'America/Sao_Paulo'
  },
  {
    code: 'IN',
    funFact: 'India has huge language, food, film, tech, and campus communities across regions.',
    greeting: 'Ask about city, language, food, or campus life instead of assuming one experience.',
    id: 'india',
    languages: ['Hindi', 'English'],
    localTrends: ['Campus rooms', 'Cricket chats', 'Builder circles'],
    name: 'India',
    peopleCount: '4.7M explorers',
    popularCommunities: ['Coding', 'Campus', 'Music'],
    popularInterests: ['Cricket', 'Tech', 'Movies'],
    region: 'South Asia',
    timeZone: 'Asia/Kolkata'
  },
  {
    code: 'FR',
    funFact: 'Food, art, football, fashion, and language exchange make natural social bridges.',
    greeting: 'A polite hello and a specific shared interest keeps the first message grounded.',
    id: 'france',
    languages: ['French', 'English'],
    localTrends: ['Art walks', 'Football rooms', 'Language cafes'],
    name: 'France',
    peopleCount: '1.3M explorers',
    popularCommunities: ['Music', 'Football', 'Culture'],
    popularInterests: ['Food', 'Art', 'Football'],
    region: 'Europe',
    timeZone: 'Europe/Paris'
  },
  {
    code: 'DE',
    funFact: 'Builder communities, music scenes, football clubs, and student groups are strong connectors.',
    greeting: 'Clear, respectful messages with a real shared topic work well.',
    id: 'germany',
    languages: ['German', 'English'],
    localTrends: ['Tech rooms', 'Football debates', 'Music events'],
    name: 'Germany',
    peopleCount: '1.5M explorers',
    popularCommunities: ['Coding', 'Football', 'Music'],
    popularInterests: ['Tech', 'Football', 'Music'],
    region: 'Europe',
    timeZone: 'Europe/Berlin'
  },
  {
    code: 'ZA',
    funFact: 'South Africa has a rich mix of languages, music scenes, sport, and creative communities.',
    greeting: 'Ask about music, food, city life, or sport while staying curious and respectful.',
    id: 'south-africa',
    languages: ['English', 'Zulu'],
    localTrends: ['Amapiano rooms', 'Football chats', 'Culture exchange'],
    name: 'South Africa',
    peopleCount: '1.1M explorers',
    popularCommunities: ['Music', 'Football', 'Culture'],
    popularInterests: ['Music', 'Food', 'Football'],
    region: 'Southern Africa',
    timeZone: 'Africa/Johannesburg'
  }
];

export const globalPeople: GlobalPerson[] = [
  {
    avatar: 'MP',
    bio: 'Building language game rooms for travelers and students.',
    city: 'Seoul',
    country: 'South Korea',
    countryCode: 'KR',
    focus: 'Gaming',
    gamerType: 'Trivia strategist',
    id: 'gp1',
    interests: ['Coding', 'Anime', 'Games'],
    languages: ['Korean', 'English'],
    learning: ['Japanese'],
    messageSafety: 'Message request preview enabled',
    mode: 'Global',
    name: 'Mina Park',
    onlineNow: true,
    timeZone: 'Asia/Seoul'
  },
  {
    avatar: 'DS',
    bio: 'Beach football, music swaps, and culture quizzes.',
    city: 'Rio',
    country: 'Brazil',
    countryCode: 'BR',
    focus: 'Global friends',
    gamerType: 'Quick Duel casual',
    id: 'gp2',
    interests: ['Football', 'Music', 'Travel'],
    languages: ['Portuguese', 'English'],
    learning: ['Spanish'],
    messageSafety: 'Stranger safety reminder shown',
    mode: 'Global',
    name: 'Diego Silva',
    onlineNow: false,
    timeZone: 'America/Sao_Paulo'
  },
  {
    avatar: 'AN',
    bio: 'Creator dinners, startup chats, and warm welcome rooms.',
    city: 'Nairobi',
    country: 'Kenya',
    countryCode: 'KE',
    focus: 'Communities',
    gamerType: 'Culture quiz host',
    id: 'gp3',
    interests: ['Startups', 'Food', 'Creators'],
    languages: ['English'],
    learning: ['French'],
    messageSafety: 'Friends-of-friends preferred',
    mode: 'Global',
    name: 'Aisha Noor',
    onlineNow: true,
    timeZone: 'Africa/Nairobi'
  },
  {
    avatar: 'LM',
    bio: 'Campus society lead looking for study circles across time zones.',
    city: 'Boston',
    country: 'United States',
    countryCode: 'US',
    focus: 'Campus',
    gamerType: 'Word Rush learner',
    id: 'gp4',
    interests: ['Campus', 'Coding', 'Music'],
    languages: ['English', 'Spanish'],
    learning: ['Korean'],
    messageSafety: 'Campus mode indicator visible',
    mode: 'Campus',
    name: 'Lena Morris',
    onlineNow: true,
    timeZone: 'America/New_York'
  }
];

export const globalEvents: GlobalEvent[] = [
  { category: 'Gaming', country: 'Global', date: 'Fri, Jul 3', id: 'ev1', region: 'Worldwide', time: '20:00', timeZone: 'UTC', title: 'Trivia Battle World Warmup' },
  { category: 'Culture', country: 'Nigeria', date: 'Sat, Jul 4', id: 'ev2', region: 'West Africa', time: '18:30', timeZone: 'Africa/Lagos', title: 'Afrobeats Conversation Night' },
  { category: 'Campus', country: 'United States', date: 'Mon, Jul 6', id: 'ev3', region: 'North America', time: '16:00', timeZone: 'America/New_York', title: 'Campus Builders Study Sprint' },
  { category: 'Community', country: 'Japan', date: 'Wed, Jul 8', id: 'ev4', region: 'East Asia', time: '21:00', timeZone: 'Asia/Tokyo', title: 'Ramen Map Exchange Room' },
  { category: 'Holiday', country: 'France', date: 'Tue, Jul 14', id: 'ev5', region: 'Europe', time: '19:00', timeZone: 'Europe/Paris', title: 'World Holiday Chat Prompts' },
  { category: 'Birthday', country: 'Global', date: 'Daily', id: 'ev6', region: 'Worldwide', time: '09:00', timeZone: 'UTC', title: 'Friend Birthday Drop-ins' }
];

export const cultureFacts: CultureFact[] = [
  {
    category: 'Greetings',
    country: 'Nigeria',
    id: 'cf1',
    prompt: 'Try asking about music, city life, or food.',
    text: 'Many conversations start warmly with a greeting and a quick check-in before the main topic.'
  },
  {
    category: 'Food',
    country: 'Japan',
    id: 'cf2',
    prompt: 'Ask for a favorite local food spot.',
    text: 'Food recommendations can be a friendly way to learn about neighborhoods, travel, and routines.'
  },
  {
    category: 'Slang',
    country: 'Brazil',
    id: 'cf3',
    prompt: 'Ask what a phrase means before using it.',
    text: 'Local slang changes by city and community, so curiosity is better than guessing.'
  },
  {
    category: 'Etiquette',
    country: 'India',
    id: 'cf4',
    prompt: 'Ask about region and language with care.',
    text: 'India is highly diverse, so one person may have a very different language or culture from another.'
  },
  {
    category: 'Music',
    country: 'South Africa',
    id: 'cf5',
    prompt: 'Invite a playlist swap.',
    text: 'Music scenes are a strong bridge for conversation, especially when people share artists from their city.'
  }
];

export function buildSmartSearchResults(query: string): SmartSearchResult[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  const matches = (...values: string[]) => values.some((value) => value.toLowerCase().includes(normalized));

  const countries = countryProfiles
    .filter((country) => matches(country.name, country.region, country.code, ...country.languages, ...country.popularInterests))
    .map((country) => ({
      category: 'Countries' as const,
      description: `${country.region} / ${country.peopleCount}`,
      id: `country-${country.id}`,
      label: country.name
    }));

  const people = [...globalPeople, ...globalMatches.map((match) => ({
    avatar: match.avatar,
    bio: match.vibe,
    city: match.distance,
    country: match.country,
    countryCode: match.countryCode,
    focus: 'Global friends' as GlobalFocus,
    gamerType: 'Social explorer',
    id: match.id,
    interests: match.interests,
    languages: ['English'],
    learning: ['Spanish'],
    messageSafety: 'Message request preview enabled',
    mode: 'Global' as const,
    name: match.name,
    onlineNow: true,
    timeZone: 'UTC'
  }))]
    .filter((person) => matches(person.name, person.country, person.city, person.bio, person.gamerType, ...person.interests, ...person.languages))
    .map((person) => ({
      category: 'People' as const,
      description: `${person.country} / ${person.languages.join(', ')}`,
      id: `person-${person.id}`,
      label: person.name
    }));

  const languages = languageOptions
    .filter((language) => matches(language))
    .map((language) => ({
      category: 'Languages' as const,
      description: 'Language profile and translation-ready discovery',
      id: `language-${language}`,
      label: language
    }));

  const communityResults = communities
    .filter((community) => matches(community.name, community.topic, community.description ?? ''))
    .map((community) => ({
      category: 'Communities' as const,
      description: community.topic,
      id: `community-${community.id}`,
      label: community.name
    }));

  const postResults = posts
    .filter((post) => matches(post.author, post.body, post.region, ...post.interests))
    .map((post) => ({
      category: 'Posts' as const,
      description: `${post.author} / ${post.region}`,
      id: `post-${post.id}`,
      label: post.body
    }));

  const games = miniGamePreviews
    .filter((game) => matches(game.name, game.genre, game.tagline))
    .map((game) => ({
      category: 'Games' as const,
      description: `${game.genre} / ${game.players}`,
      id: `game-${game.id}`,
      label: game.name
    }));

  const events = globalEvents
    .filter((event) => matches(event.title, event.category, event.country, event.region))
    .map((event) => ({
      category: 'Events' as const,
      description: `${event.date} at ${event.time} ${event.timeZone}`,
      id: `event-${event.id}`,
      label: event.title
    }));

  const facts = cultureFacts
    .filter((fact) => matches(fact.country, fact.category, fact.text, fact.prompt))
    .map((fact) => ({
      category: 'Culture' as const,
      description: `${fact.country} / ${fact.category}`,
      id: `fact-${fact.id}`,
      label: fact.prompt
    }));

  return [...people, ...countries, ...languages, ...communityResults, ...postResults, ...games, ...events, ...facts].slice(0, 12);
}
