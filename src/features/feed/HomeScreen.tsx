import { Bookmark, Bot, CalendarDays, Globe2, Heart, MessageCircle, Radio, Repeat2, Share2, UsersRound, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { globalMatches, posts as mockPosts, stories, trendingConversations } from '../../app/data';
import { Avatar } from '../../components/Avatar';
import { SearchBar } from '../../components/SearchBar';
import { ScreenHeader } from '../../components/ScreenHeader';
import { TranslationToggle } from '../../components/language/TranslationToggle';
import type { Post, Story } from '../../app/types';
import { buildSmartSearchResults, countryProfiles } from '../../data/mockGlobalData';
import { getFeedPosts } from '../../services/postService';
import type { GlobalOnboardingProfile, GlobalSafetySettings } from '../../types/global';

type HomeScreenProps = {
  globalProfile: GlobalOnboardingProfile;
  globalSettings: GlobalSafetySettings;
  onOpenAiChat: () => void;
  onOpenCommunities: () => void;
  onOpenCalendar: () => void;
  onOpenGlobal: () => void;
  onStartChat: () => void;
};

type PostActionState = {
  comments: number;
  liked: boolean;
  likes: number;
  saved: boolean;
  shares: number;
};

const quickActions = [
  { label: 'Ace AI', icon: Bot, tone: 'text-[color:var(--ad-accent)]' },
  { label: 'Global', icon: Globe2, tone: 'text-cyan-300' },
  { label: 'Calendar', icon: CalendarDays, tone: 'text-blue-300' },
  { label: 'Rooms', icon: UsersRound, tone: 'text-frost/80' }
];

function parseStat(value: string) {
  if (value.endsWith('K')) {
    return Math.round(Number(value.replace('K', '')) * 1000);
  }

  return Number(value.replace(/,/g, ''));
}

function formatStat(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 1 : 1)}K`;
  }

  return String(value);
}

function buildInitialPostActions(feedPosts: Post[]) {
  return Object.fromEntries(
    feedPosts.map((post) => [
      post.id,
      {
        comments: parseStat(post.stats.comments),
        liked: false,
        likes: parseStat(post.stats.likes),
        saved: false,
        shares: parseStat(post.stats.shares)
      }
    ])
  ) as Record<string, PostActionState>;
}

function StoryViewer({ story, onClose }: { story: Story; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-void/95 px-4 py-6 backdrop-blur-2xl sm:items-center">
      <div className="w-full max-w-md animate-rise">
        <div className="mb-4 flex gap-1">
          {stories.map((item) => (
            <div key={item.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <div className={`h-full rounded-full ${item.id === story.id ? 'w-4/5 origin-left animate-storyProgress bg-cyan-300' : 'w-full bg-white/25'}`} />
            </div>
          ))}
        </div>
        <div className="relative min-h-[480px] overflow-hidden rounded-[28px] border border-white/10 bg-[#060a14] p-5 shadow-panel">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white"
            aria-label="Close story"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3">
            <Avatar label={story.avatar} active={story.live} />
            <div>
              <h2 className="font-bold text-white">{story.name}</h2>
              <p className="text-xs text-frost/55">{story.location}</p>
            </div>
          </div>
          <div className="mt-16 grid place-items-center">
            <div className="grid h-36 w-36 place-items-center rounded-full bg-gradient-to-br from-[#0D47FF] via-[#00B2FF] to-[#00F0FF] p-1">
              <div className="grid h-full w-full place-items-center rounded-full bg-void text-6xl font-black text-white">
                {story.avatar}
              </div>
            </div>
          </div>
          <div className="absolute bottom-5 left-5 right-5">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">Story live</p>
            <h3 className="mt-2 text-2xl font-black text-white">{story.caption}</h3>
            <p className="mt-2 text-sm text-frost/60">Reply, react, and meet through story moments as Ace Domain expands.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomeScreen({ globalProfile, globalSettings, onOpenAiChat, onOpenCalendar, onOpenCommunities, onOpenGlobal, onStartChat }: HomeScreenProps) {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [feedPosts, setFeedPosts] = useState<Post[]>(mockPosts);
  const [postActions, setPostActions] = useState<Record<string, PostActionState>>(() => buildInitialPostActions(mockPosts));
  const [searchQuery, setSearchQuery] = useState('');
  const profileCountry = useMemo(
    () => countryProfiles.find((country) => country.name === globalProfile.country) ?? countryProfiles[0],
    [globalProfile.country]
  );

  useEffect(() => {
    let isMounted = true;

    getFeedPosts().then((result) => {
      if (!isMounted) {
        return;
      }

      setFeedPosts(result.data);
      setPostActions(buildInitialPostActions(result.data));
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const searchResults = useMemo(() => buildSmartSearchResults(searchQuery), [searchQuery]);
  const hasSearchQuery = searchQuery.trim().length > 0;

  const updatePost = (postId: string, updater: (current: PostActionState) => PostActionState) => {
    setPostActions((current) => ({ ...current, [postId]: updater(current[postId]) }));
  };

  const handleQuickAction = (label: string) => {
    if (label === 'Ace AI') {
      onOpenAiChat();
    } else if (label === 'Global') {
      onOpenGlobal();
    } else if (label === 'Calendar') {
      onOpenCalendar();
    } else {
      onOpenCommunities();
    }
  };

  return (
    <section className="pb-4">
      <ScreenHeader
        eyebrow={globalSettings.hideCountry ? globalProfile.focus : `${globalProfile.focus} / ${profileCountry.code}`}
        title="Ace Domain"
        action={
          <div className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-cyan-300" aria-hidden="true">
            <Radio size={20} />
          </div>
        }
      />
      <SearchBar placeholder="Search people, posts, communities, countries..." value={searchQuery} onChange={setSearchQuery} />

      <div className="mt-4 overflow-x-auto px-4 [scrollbar-width:none]">
        <div className="flex gap-3">
          {stories.map((story) => (
            <button
              key={story.id}
              type="button"
              onClick={() => setActiveStory(story)}
              className="w-16 shrink-0 text-center"
              aria-label={`Open ${story.name} story`}
            >
              <Avatar label={story.avatar} active={story.live} />
              <p className="mt-2 truncate text-xs font-semibold text-white">{story.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 px-4">
        {quickActions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => handleQuickAction(action.label)}
            className="flex min-h-16 flex-col items-center justify-center rounded-2xl bg-white/[0.055] px-2 py-2 text-xs font-bold text-frost/75"
          >
            <action.icon className={action.tone} size={19} />
            <span className="mt-1 truncate">{action.label}</span>
          </button>
        ))}
      </div>

      {hasSearchQuery && (
        <div className="mx-4 mt-4 rounded-2xl border border-white/10 bg-[#0b101c] p-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold text-white">Search results</h2>
            <button type="button" onClick={() => setSearchQuery('')} className="text-xs font-bold text-frost/50" aria-label="Clear search">
              Clear
            </button>
          </div>
          <div className="mt-3 grid gap-1">
            {searchResults.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl px-1 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">{item.label}</p>
                  <p className="truncate text-xs text-frost/50">{item.description}</p>
                </div>
                <span className="shrink-0 rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold text-cyan-300">{item.category}</span>
              </div>
            ))}
            {searchResults.length === 0 && <p className="py-2 text-sm text-frost/55">No local results yet. Try Gaming, Seoul, Yoruba, food, or calendar.</p>}
          </div>
        </div>
      )}

      <div className="mx-4 mt-5 border-y border-white/10 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-frost/45">Global pulse</h2>
            <p className="mt-1 text-sm text-frost/55">Matches and conversations without crowding the feed.</p>
          </div>
          <button type="button" onClick={onOpenGlobal} className="rounded-full bg-white px-3 py-2 text-xs font-black text-void">
            Explore
          </button>
        </div>
        <div className="mt-3 grid gap-2">
          {trendingConversations.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3">
              <p className="truncate text-sm font-bold text-white">{item.title}</p>
              <span className="shrink-0 text-xs text-cyan-300">{item.pulse}</span>
            </div>
          ))}
          <button type="button" onClick={onStartChat} className="mt-1 flex items-center gap-3 rounded-2xl bg-white/[0.055] p-3 text-left">
            <Avatar label={globalMatches[0].avatar} active />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">{globalMatches[0].name}</p>
              <p className="truncate text-xs text-frost/50">{globalMatches[0].country} / {globalMatches[0].vibe}</p>
            </div>
            <span className="rounded-full bg-cyan-300/15 px-2 py-1 text-[10px] font-black text-cyan-300">Chat</span>
          </button>
        </div>
      </div>

      <div className="mt-5 px-4">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-frost/45">For you</h2>
      </div>

      <div className="mt-1 divide-y divide-white/10">
        {feedPosts.map((post) => {
          const action =
            postActions[post.id] ?? {
              comments: parseStat(post.stats.comments),
              liked: false,
              likes: parseStat(post.stats.likes),
              saved: false,
              shares: parseStat(post.stats.shares)
            };
          return (
            <article key={post.id} className="px-4 py-4">
              <div className="flex items-center gap-3">
                <Avatar label={post.avatar} active />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-bold text-white">{post.author}</h3>
                  <p className="truncate text-xs text-frost/50">{post.handle} / {post.region} / {post.timestamp}</p>
                </div>
              </div>
              <TranslationToggle className="mt-3 text-[15px] leading-6" text={post.body} translatedText={`Translation preview: ${post.body}`} />
              <div className="mt-3 flex flex-wrap gap-2">
                {post.interests.map((interest) => (
                  <span key={interest} className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-frost/65">
                    {interest}
                  </span>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-4 gap-1 text-xs text-frost/60">
                <button
                  type="button"
                  onClick={() => updatePost(post.id, (current) => ({ ...current, liked: !current.liked, likes: current.likes + (current.liked ? -1 : 1) }))}
                  className={`flex min-w-0 items-center gap-1 rounded-full py-2 ${action.liked ? 'text-plasma' : ''}`}
                  aria-label={`${action.liked ? 'Unlike' : 'Like'} ${post.author}'s post`}
                >
                  <Heart className="shrink-0" size={16} fill={action.liked ? 'currentColor' : 'none'} /> <span className="truncate">{formatStat(action.likes)}</span>
                </button>
                <button
                  type="button"
                  onClick={() => updatePost(post.id, (current) => ({ ...current, comments: current.comments + 1 }))}
                  className="flex min-w-0 items-center gap-1 rounded-full py-2"
                  aria-label={`Comment on ${post.author}'s post`}
                >
                  <MessageCircle className="shrink-0" size={16} /> <span className="truncate">{formatStat(action.comments)}</span>
                </button>
                <button
                  type="button"
                  onClick={() => updatePost(post.id, (current) => ({ ...current, shares: current.shares + 1 }))}
                  className="flex min-w-0 items-center gap-1 rounded-full py-2"
                  aria-label={`Share ${post.author}'s post`}
                >
                  <Share2 className="shrink-0" size={16} /> <span className="truncate">{formatStat(action.shares)}</span>
                </button>
                <button
                  type="button"
                  onClick={() => updatePost(post.id, (current) => ({ ...current, saved: !current.saved }))}
                  className={`flex min-w-0 items-center justify-end gap-1 rounded-full py-2 ${action.saved ? 'text-cyan-300' : ''}`}
                  aria-label={`${action.saved ? 'Unsave' : 'Save'} ${post.author}'s post`}
                >
                  <Bookmark className="shrink-0" size={16} fill={action.saved ? 'currentColor' : 'none'} /> <span className="truncate">Save</span>
                </button>
              </div>
            </article>
          );
        })}
        <div className="flex items-center justify-center gap-2 px-4 py-5 text-xs text-frost/40">
          <Repeat2 size={14} />
          Feed ready for future realtime updates
        </div>
      </div>

      {activeStory && <StoryViewer story={activeStory} onClose={() => setActiveStory(null)} />}
    </section>
  );
}
