import { Bookmark, Bot, Gamepad2, Heart, MessageCircle, Radio, Repeat2, Rocket, Share2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { globalMatches, miniGamePreviews, posts as mockPosts, stories, trendingConversations } from '../../app/data';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { CountryBadge } from '../../components/global/CountryBadge';
import { CultureFactCard } from '../../components/global/CultureFactCard';
import { WorldClockLabel } from '../../components/global/WorldClockLabel';
import { LanguageBadge } from '../../components/language/LanguageBadge';
import { TranslationToggle } from '../../components/language/TranslationToggle';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SearchBar } from '../../components/SearchBar';
import type { Post, Story } from '../../app/types';
import { buildSmartSearchResults, countryProfiles, cultureFacts, globalEvents } from '../../data/mockGlobalData';
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
              <div
                className={`h-full rounded-full ${
                  item.id === story.id
                    ? 'w-4/5 origin-left animate-storyProgress bg-aurora shadow-[0_0_18px_rgba(115,251,211,0.45)]'
                    : 'w-full bg-white/25'
                }`}
              />
            </div>
          ))}
        </div>
        <div
          className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-signal/30 via-obsidian to-void p-5 shadow-panel"
          style={{ height: 'min(620px, calc(100svh - 72px))', minHeight: '480px' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white"
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
          <div className="mt-[clamp(2rem,9svh,5rem)] grid place-items-center">
            <div className="grid h-36 w-36 place-items-center rounded-full bg-gradient-to-br from-white via-aurora to-plasma p-1 shadow-glow animate-float sm:h-52 sm:w-52">
              <div className="grid h-full w-full place-items-center rounded-full bg-void text-6xl font-black text-white">
                {story.avatar}
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 left-5 right-5 rounded-[28px] bg-white/10 p-4 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-aurora">Story live</p>
            <h3 className="mt-2 text-xl font-black text-white sm:text-2xl">{story.caption}</h3>
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

  return (
    <section className="pb-6">
      <ScreenHeader
        eyebrow="Live network"
        title="Ace Domain"
        action={
          <button className="grid h-11 w-11 place-items-center rounded-full bg-white text-void shadow-glow" type="button" aria-label="Open live network">
            <Radio size={20} />
          </button>
        }
      />
      <SearchBar
        placeholder="Search people, countries, languages, games, events..."
        value={searchQuery}
        onChange={setSearchQuery}
      />

      <div className="mx-5 mt-5 overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.1] via-white/[0.05] to-transparent p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl ad-accent-bg ad-accent-ring">
            <Bot size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[color:var(--ad-accent)]">New assistant</p>
            <h2 className="truncate font-black text-white">Ace AI</h2>
            <p className="mt-1 text-sm leading-5 text-frost/55">Ask for culture prompts, better openers, travel ideas, or community inspiration.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenAiChat}
          className="mt-4 w-full rounded-full px-5 py-3 text-sm font-black ad-accent-bg"
          aria-label="Open Ace Domain AI chat"
        >
          Open Ace AI
        </button>
      </div>

      {hasSearchQuery && (
        <div className="mx-5 mt-4 rounded-[28px] border border-white/10 bg-white/[0.06] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-white">Ace smart search</h2>
              <p className="text-xs text-frost/50">Filtered across people, countries, languages, communities, posts, games, events, and culture facts.</p>
            </div>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-frost/70"
              aria-label="Clear search"
            >
              Clear
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            {searchResults.map((item) => (
              <div key={item.id} className="rounded-2xl bg-white/[0.06] px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-bold text-white">{item.label}</p>
                  <span className="shrink-0 rounded-full bg-aurora/10 px-2 py-1 text-[10px] font-bold text-aurora">{item.category}</span>
                </div>
                <p className="mt-1 truncate text-xs text-frost/50">{item.description}</p>
              </div>
            ))}
            {searchResults.length === 0 && (
              <p className="rounded-2xl bg-white/[0.06] px-3 py-3 text-sm text-frost/55">No local results yet. Try Gaming, Seoul, Yoruba, food, or calendar.</p>
            )}
          </div>
        </div>
      )}

      <div className="mx-5 mt-5 rounded-[32px] border border-white/10 bg-white/[0.06] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-aurora">World profile</p>
            <h2 className="mt-1 text-xl font-black text-white">{globalProfile.focus}</h2>
            <p className="mt-1 text-sm text-frost/55">
              {globalSettings.lowDataMode ? 'Low-data mode is active.' : 'Global discovery is tuned locally.'}
            </p>
          </div>
          {!globalSettings.hideCountry && <CountryBadge code={profileCountry.code} label={globalProfile.country} />}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {!globalSettings.hideLanguages && (
            <>
              <LanguageBadge label={globalProfile.appLanguage} tone="preferred" />
              {globalProfile.languagesSpoken.slice(0, 2).map((language) => <LanguageBadge key={language} label={language} />)}
              {globalProfile.languagesLearning.slice(0, 2).map((language) => <LanguageBadge key={language} label={language} tone="learning" />)}
            </>
          )}
          {!globalSettings.hideLocalTime && <WorldClockLabel timeZone={profileCountry.timeZone} />}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button onClick={onOpenGlobal} className="py-3">Global</Button>
          <Button variant="secondary" onClick={onOpenCalendar} className="py-3">Calendar</Button>
        </div>
      </div>

      <div className="mx-5 mt-5 rounded-[32px] bg-gradient-to-br from-aurora/25 via-signal/20 to-plasma/20 p-[1px]">
        <div className="rounded-[31px] bg-obsidian/90 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-void">
              <Rocket size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-white">Global Match</h2>
              <p className="text-sm text-frost/60">Meet aligned people worldwide in one tap.</p>
            </div>
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto [scrollbar-width:none]">
            {globalMatches.map((match) => (
              <article key={match.id} className="w-64 shrink-0 rounded-[28px] border border-white/10 bg-white/[0.07] p-4">
                <div className="flex items-center gap-3">
                  <Avatar label={match.avatar} active />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-bold text-white">{match.name}</h3>
                    <p className="text-xs text-aurora">{match.countryCode} / {match.distance}</p>
                  </div>
                </div>
                <span className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-frost/70">
                  {match.country}
                </span>
                <p className="mt-3 line-clamp-2 text-sm leading-5 text-frost/65">{match.vibe}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {match.interests.map((interest) => (
                    <span key={interest} className="rounded-full bg-aurora/10 px-2 py-1 text-[11px] font-bold text-aurora">
                      {interest}
                    </span>
                  ))}
                </div>
                <Button onClick={onStartChat} className="mt-4 w-full py-3" aria-label={`Start chat with ${match.name}`}>
                  Start Chat
                </Button>
              </article>
            ))}
          </div>
          <Button variant="secondary" className="mt-4 w-full" onClick={onOpenCommunities}>
            Explore More Worlds
          </Button>
        </div>
      </div>

      <div className="mx-5 mt-5 rounded-[28px] border border-white/10 bg-white/[0.05] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-white">Global Calendar</h2>
            <p className="mt-1 text-sm text-frost/55">Events, culture days, tournaments, meetups, and birthdays.</p>
          </div>
          <button type="button" onClick={onOpenCalendar} className="rounded-full bg-white px-4 py-2 text-xs font-bold text-void">
            Open
          </button>
        </div>
        <div className="mt-4 grid gap-3">
          {globalEvents.slice(0, 2).map((event) => (
            <div key={event.id} className="rounded-3xl bg-white/[0.06] p-3">
              <p className="font-bold text-white">{event.title}</p>
              <p className="mt-1 text-xs text-frost/50">{event.date} / {event.time} / {event.timeZone}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto px-5 [scrollbar-width:none]">
        <div className="flex gap-3">
          {stories.map((story) => (
            <button
              key={story.id}
              type="button"
              onClick={() => setActiveStory(story)}
              className="w-20 shrink-0 rounded-3xl bg-white/[0.06] p-2 text-center"
              aria-label={`Open ${story.name} story`}
            >
              <Avatar label={story.avatar} active={story.live} />
              <p className="mt-2 truncate text-xs font-semibold text-white">{story.name}</p>
              <p className="truncate text-[10px] text-frost/45">{story.location}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 px-5">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-frost/50">Trending Global Conversations</h2>
        <div className="grid gap-3">
          {trendingConversations.map((item) => (
            <article key={item.id} className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white">{item.title}</h3>
                  <p className="mt-1 text-xs text-frost/45">{item.region}</p>
                </div>
                <span className="rounded-full bg-plasma/15 px-3 py-1 text-xs font-bold text-plasma">{item.pulse}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mx-5 mt-5 rounded-[28px] border border-white/10 bg-white/[0.05] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-white">Mini-Game Hub</h2>
            <p className="mt-1 text-sm text-frost/55">Preview game rooms for fast social play.</p>
          </div>
          <Gamepad2 className="text-aurora" size={22} />
        </div>
        <div className="mt-4 flex gap-3 overflow-x-auto [scrollbar-width:none]">
          {miniGamePreviews.map((game) => (
            <div key={game.id} className="w-44 shrink-0 rounded-3xl bg-gradient-to-br from-white/12 to-white/[0.04] p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-white">{game.name}</p>
                <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${game.status === 'ready' ? 'bg-aurora/15 text-aurora' : 'bg-white/10 text-frost/55'}`}>
                  {game.status === 'ready' ? 'Ready' : 'Soon'}
                </span>
              </div>
              <p className="mt-2 text-xs text-frost/50">{game.genre}</p>
              <p className="mt-3 text-xs leading-5 text-frost/60">{game.tagline}</p>
              <p className="mt-4 text-xs font-bold text-aurora">{game.players}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-5 mt-5">
        <CultureFactCard fact={cultureFacts[0]} />
      </div>

      <div className="space-y-4 px-5 py-5">
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
            <article key={post.id} className="glass-panel rounded-[28px] p-4">
              <div className="flex items-center gap-3">
                <Avatar label={post.avatar} active />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-bold text-white">{post.author}</h3>
                  <p className="truncate text-xs text-frost/50">
                    {post.handle} / {post.region} / {post.timestamp}
                  </p>
                </div>
              </div>
              <TranslationToggle
                className="mt-4 text-sm leading-6"
                text={post.body}
                translatedText={`Translation preview: ${post.body}`}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {post.interests.map((interest) => (
                  <span key={interest} className="rounded-full bg-aurora/10 px-3 py-1 text-xs font-semibold text-aurora">
                    {interest}
                  </span>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 border-t border-white/10 pt-4 text-xs text-frost/60">
                <button
                  type="button"
                  onClick={() => updatePost(post.id, (current) => ({ ...current, liked: !current.liked, likes: current.likes + (current.liked ? -1 : 1) }))}
                  className={`flex items-center gap-1 rounded-full px-2 py-2 transition ${action.liked ? 'bg-plasma/15 text-plasma' : 'hover:bg-white/10'}`}
                  aria-label={`${action.liked ? 'Unlike' : 'Like'} ${post.author}'s post`}
                >
                  <Heart size={15} fill={action.liked ? 'currentColor' : 'none'} /> {formatStat(action.likes)}
                </button>
                <button
                  type="button"
                  onClick={() => updatePost(post.id, (current) => ({ ...current, comments: current.comments + 1 }))}
                  className="flex items-center gap-1 rounded-full px-2 py-2 hover:bg-white/10"
                  aria-label={`Comment on ${post.author}'s post`}
                >
                  <MessageCircle size={15} /> {formatStat(action.comments)}
                </button>
                <button
                  type="button"
                  onClick={() => updatePost(post.id, (current) => ({ ...current, shares: current.shares + 1 }))}
                  className="flex items-center gap-1 rounded-full px-2 py-2 hover:bg-white/10"
                  aria-label={`Share ${post.author}'s post`}
                >
                  <Share2 size={15} /> {formatStat(action.shares)}
                </button>
                <button
                  type="button"
                  onClick={() => updatePost(post.id, (current) => ({ ...current, saved: !current.saved }))}
                  className={`flex items-center gap-1 rounded-full px-2 py-2 transition ${action.saved ? 'bg-aurora/15 text-aurora' : 'hover:bg-white/10'}`}
                  aria-label={`${action.saved ? 'Unsave' : 'Save'} ${post.author}'s post`}
                >
                  <Bookmark size={15} fill={action.saved ? 'currentColor' : 'none'} /> Save
                </button>
              </div>
            </article>
          );
        })}
        <div className="flex items-center justify-center gap-2 pb-3 text-xs text-frost/40">
          <Repeat2 size={14} />
          Feed optimized for fast future realtime updates
        </div>
      </div>

      {activeStory && <StoryViewer story={activeStory} onClose={() => setActiveStory(null)} />}
    </section>
  );
}
