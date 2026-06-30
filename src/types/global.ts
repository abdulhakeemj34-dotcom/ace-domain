export type GlobalFocus = 'Global friends' | 'Gaming' | 'Campus' | 'Culture' | 'Communities';

export type GlobalOnboardingProfile = {
  appLanguage: string;
  country: string;
  focus: GlobalFocus;
  interests: string[];
  languagesLearning: string[];
  languagesSpoken: string[];
  region: string;
};

export type CountryProfile = {
  code: string;
  funFact: string;
  greeting: string;
  id: string;
  languages: string[];
  localTrends: string[];
  name: string;
  peopleCount: string;
  popularCommunities: string[];
  popularInterests: string[];
  region: string;
  timeZone: string;
};

export type GlobalPerson = {
  avatar: string;
  bio: string;
  city: string;
  country: string;
  countryCode: string;
  focus: GlobalFocus;
  gamerType: string;
  id: string;
  interests: string[];
  languages: string[];
  learning: string[];
  messageSafety: string;
  mode: 'Campus' | 'Global';
  name: string;
  onlineNow: boolean;
  timeZone: string;
};

export type GlobalEvent = {
  category: 'Birthday' | 'Campus' | 'Community' | 'Culture' | 'Gaming' | 'Holiday';
  country: string;
  date: string;
  id: string;
  region: string;
  time: string;
  timeZone: string;
  title: string;
};

export type CultureFact = {
  category: 'Etiquette' | 'Food' | 'Greetings' | 'Language' | 'Music' | 'Slang';
  country: string;
  id: string;
  prompt: string;
  text: string;
};

export type GlobalSafetySettings = {
  biggerText: boolean;
  clearerLabels: boolean;
  highContrast: boolean;
  hideCountry: boolean;
  hideLanguages: boolean;
  hideLocalTime: boolean;
  hideOnlineStatus: boolean;
  lowDataMode: boolean;
  messageRequests: boolean;
  reducedMotion: boolean;
  whoCanMessage: 'Everyone' | 'Friends of friends' | 'Only friends';
};

export type SmartSearchResult = {
  category: 'Communities' | 'Countries' | 'Culture' | 'Events' | 'Games' | 'Languages' | 'People' | 'Posts';
  description: string;
  id: string;
  label: string;
};
