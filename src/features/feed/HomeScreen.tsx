import { Bookmark, Bot, CalendarDays, Globe2, Heart, MessageCircle, Repeat2, Share2, UsersRound, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { globalMatches, posts as mockPosts, stories, trendingConversations } from '../../app/data';
import type { Post, Story } from '../../app/types';
import { Avatar } from '../../components/Avatar';
import { AceDomainIcon } from '../../components/logo/AceDomainIcon';
import { SearchBar } from '../../components/SearchBar';
import { TranslationToggle } from '../../components/language/TranslationToggle';
import { buildSmartSearchResults } from '../../data/mockGlobalData';
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

const feedTabs = ['For you', 'Following', 'Global'] as const;

function parseStat(value: string) {
  if (value.endsWith('K')) {
    return Math.round(Number(value.replace('K', '')) * 1000);
  }

  return Number(value.replace(/,/g, ''));
}

function formatStat(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
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
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black px-4 py-6 sm:items-center">
      <div className="w-full max-w-md animate-rise">
        <div className="mb-4 flex gap-1">
          {stories.map((item) => (
            <div key={item.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
              <div className={`h-full rounded-full ${item.id === story.id ? 'w-4/5 origin-left animate-storyProgress bg-white' : 'w-full bg-white/35'}`} />
            </div>
          ))}
        </div>
        <div className="relative min-h-[480px] overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950 p-5">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-black/60 text-white"
            aria-label="Close story"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3">
            <Avatar label={story.avatar} active={story.live} />
            <div>
              <h2 className="font-bold text-white">{story.name}</h2>
              <p className="text-xs text-zinc-500">{story.location}</p>
            </div>
          </div>
          <div className="mt-16 grid place-items-center">
            <div className="grid h-36 w-36 place-items-center rounded-full border border-white/15 bg-black text-6xl font-black text-white">
              {story.avatar}
            </div>
          </div>
          <div className="absolute bottom-5 left-5 right-5">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-zinc-500">Story</p>
            <h3 className="mt-2 text-2xl font-black text-white">{story.caption}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomeScreen({ globalProfile, globalSettings, onOpenAiChat, onOpenCalendar, onOpenCommunities, onOpenGlobal, onStartChat }: HomeScreenProps) {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof feedTabs)[number]>('For you');
  const [feedPosts, setFeedPosts] = useState<Post[]>(mockPosts);
  const [postActions, setPostActions] = useState<Record<string, PostActionState>>(() => buildInitialPostActions(mockPosts));
  const [searchQuery, setSearchQuery] = useState('');

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
  const identityLabel = globalSettings.hideCountry ? globalProfile.focus : `${globalProfile.focus} / ${globalProfile.country}`;

  const updatePost = (postId: string, updater: (current: PostActionState) => PostActionState) => {
    setPostActions((current) => ({ ...current, [postId]: updater(current[postId]) }));
  };

  return (
    <section className="bg-black pb-4 text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/95 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <AceDomainIcon size="sm" withGlow={false} />
            <div>
              <h1 className="text-xl font-black leading-none">Ace Domain</h1>
              <p className="mt-1 max-w-[11rem] truncate text-[11px] text-zinc-500">{identityLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={onOpenAiChat} className="grid h-10 w-10 place-items-center rounded-full text-zinc-300 hover:bg-white/10" aria-label="Open Ace AI">
              <Bot size={20} />
            </button>
            <button type="button" onClick={onOpenGlobal} className="grid h-10 w-10 place-items-center rounded-full text-zinc-300 hover:bg-white/10" aria-label="Open global discovery">
              <Globe2 size={20} />
            </button>
            <button type="button" onClick={onOpenCalendar} className="grid h-10 w-10 place-items-center rounded-full text-zinc-300 hover:bg-white/10" aria-label="Open calendar">
              <CalendarDays size={20} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3">
          {feedTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative min-h-11 text-sm font-bold ${activeTab === tab ? 'text-white' : 'text-zinc-500'}`}
            >
              {tab}
              {activeTab === tab && <span className="absolute bottom-0 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-[#1d9bf0]" />}
            </button>
          ))}
        </div>
      </header>

      <SearchBar placeholder="Search Ace Domain..." value={searchQuery} onChange={setSearchQuery} />

      {hasSearchQuery && (
        <div className="mt-3 border-y border-white/10">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="font-bold text-white">Search results</h2>
            <button type="button" onClick={() => setSearchQuery('')} className="text-sm font-bold text-zinc-500" aria-label="Clear search">
              Clear
            </button>
          </div>
          <div className="divide-y divide-white/10">
            {searchResults.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">{item.label}</p>
                  <p className="truncate text-xs text-zinc-500">{item.description}</p>
                </div>
                <span className="shrink-0 text-xs font-bold text-[#1d9bf0]">{item.category}</span>
              </div>
            ))}
            {searchResults.length === 0 && <p className="px-4 py-3 text-sm text-zinc-500">No local results yet.</p>}
          </div>
        </div>
      )}

      <div className="border-b border-white/10 px-4 py-3">
        <div className="flex gap-4 overflow-x-auto [scrollbar-width:none]">
          {stories.map((story) => (
            <button
              key={story.id}
              type="button"
              onClick={() => setActiveStory(story)}
              className="w-16 shrink-0 text-center"
              aria-label={`Open ${story.name} story`}
            >
              <Avatar label={story.avatar} active={story.live} />
              <p className="mt-2 truncate text-xs font-semibold text-zinc-300">{story.name}</p>
            </button>
          ))}
        </div>
      </div>

      <section className="border-b border-white/10">
        <button type="button" onClick={onOpenCommunities} className="flex w-full items-center gap-3 px-4 py-3 text-left">
          <UsersRound size={20} className="text-zinc-400" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">Communities</p>
            <p className="truncate text-xs text-zinc-500">Open rooms, interests, and culture groups.</p>
          </div>
        </button>
        {trendingConversations.slice(0, 2).map((item) => (
          <button key={item.id} type="button" onClick={onOpenGlobal} className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-200">{item.title}</p>
              <p className="truncate text-xs text-zinc-500">{item.region}</p>
            </div>
            <span className="shrink-0 text-xs text-zinc-500">{item.pulse}</span>
          </button>
        ))}
        <button type="button" onClick={onStartChat} className="flex w-full items-center gap-3 px-4 py-3 text-left">
          <Avatar label={globalMatches[0].avatar} active />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{globalMatches[0].name}</p>
            <p className="truncate text-xs text-zinc-500">{globalMatches[0].country} / {globalMatches[0].vibe}</p>
          </div>
          <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-bold text-white">Chat</span>
        </button>
      </section>

      <div className="divide-y divide-white/10">
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
              <div className="flex items-start gap-3">
                <Avatar label={post.avatar} active />
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <h3 className="truncate font-bold text-white">{post.author}</h3>
                    <span className="shrink-0 text-sm text-zinc-500">{post.handle}</span>
                    <span className="shrink-0 text-sm text-zinc-500">/ {post.timestamp}</span>
                  </div>
                  <p className="truncate text-xs text-zinc-500">{post.region}</p>
                  <TranslationToggle className="mt-2 text-[15px] leading-6" text={post.body} translatedText={`Translation preview: ${post.body}`} />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.interests.map((interest) => (
                      <span key={interest} className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-zinc-500">
                        {interest}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-1 text-xs text-zinc-500">
                    <button
                      type="button"
                      onClick={() => updatePost(post.id, (current) => ({ ...current, liked: !current.liked, likes: current.likes + (current.liked ? -1 : 1) }))}
                      className={`flex min-w-0 items-center gap-1 py-2 ${action.liked ? 'text-red-400' : ''}`}
                      aria-label={`${action.liked ? 'Unlike' : 'Like'} ${post.author}'s post`}
                    >
                      <Heart className="shrink-0" size={16} fill={action.liked ? 'currentColor' : 'none'} /> <span className="truncate">{formatStat(action.likes)}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updatePost(post.id, (current) => ({ ...current, comments: current.comments + 1 }))}
                      className="flex min-w-0 items-center gap-1 py-2"
                      aria-label={`Comment on ${post.author}'s post`}
                    >
                      <MessageCircle className="shrink-0" size={16} /> <span className="truncate">{formatStat(action.comments)}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updatePost(post.id, (current) => ({ ...current, shares: current.shares + 1 }))}
                      className="flex min-w-0 items-center gap-1 py-2"
                      aria-label={`Share ${post.author}'s post`}
                    >
                      <Share2 className="shrink-0" size={16} /> <span className="truncate">{formatStat(action.shares)}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updatePost(post.id, (current) => ({ ...current, saved: !current.saved }))}
                      className={`flex min-w-0 items-center justify-end gap-1 py-2 ${action.saved ? 'text-white' : ''}`}
                      aria-label={`${action.saved ? 'Unsave' : 'Save'} ${post.author}'s post`}
                    >
                      <Bookmark className="shrink-0" size={16} fill={action.saved ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
        <div className="flex items-center justify-center gap-2 px-4 py-5 text-xs text-zinc-600">
          <Repeat2 size={14} />
          You are caught up
        </div>
      </div>

      {activeStory && <StoryViewer story={activeStory} onClose={() => setActiveStory(null)} />}
    </section>
  );
}
