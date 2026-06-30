import { Bookmark, Gamepad2, Heart, MessageCircle, Radio, Repeat2, Rocket, Share2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { communities, globalMatches, miniGamePreviews, posts, stories, trendingConversations } from '../../app/data';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SearchBar } from '../../components/SearchBar';
import type { Post, Story } from '../../app/types';

type HomeScreenProps = {
  onOpenCommunities: () => void;
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
            <p className="mt-2 text-sm text-frost/60">Reply, react, and meet through story moments in a future realtime layer.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomeScreen({ onOpenCommunities, onStartChat }: HomeScreenProps) {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [postActions, setPostActions] = useState<Record<string, PostActionState>>(() => buildInitialPostActions(posts));
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!normalizedQuery) {
      return null;
    }

    const matchesText = (...values: string[]) => values.some((value) => value.toLowerCase().includes(normalizedQuery));

    return {
      communities: communities.filter((community) => matchesText(community.name, community.topic, community.description ?? '')),
      games: miniGamePreviews.filter((game) => matchesText(game.name, game.genre, game.tagline)),
      matches: globalMatches.filter((match) => matchesText(match.name, match.country, match.vibe, ...match.interests)),
      posts: posts.filter((post) => matchesText(post.author, post.body, post.region, ...post.interests)),
      stories: stories.filter((story) => matchesText(story.name, story.location, story.caption ?? ''))
    };
  }, [normalizedQuery]);

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
        placeholder="Search people, worlds, games, trends..."
        value={searchQuery}
        onChange={setSearchQuery}
      />

      {searchResults && (
        <div className="mx-5 mt-4 rounded-[28px] border border-white/10 bg-white/[0.06] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-white">Ace AI Search</h2>
              <p className="text-xs text-frost/50">Filtered across people, posts, communities, and games.</p>
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
            {[...searchResults.matches, ...searchResults.communities, ...searchResults.games, ...searchResults.posts, ...searchResults.stories]
              .slice(0, 6)
              .map((item) => (
                <div key={item.id} className="rounded-2xl bg-white/[0.06] px-3 py-2">
                  <p className="text-sm font-bold text-white">{'name' in item ? item.name : item.author}</p>
                  <p className="truncate text-xs text-frost/50">
                    {'country' in item ? item.country : 'topic' in item ? item.topic : 'genre' in item ? item.genre : 'body' in item ? item.body : item.location}
                  </p>
                </div>
              ))}
            {[...searchResults.matches, ...searchResults.communities, ...searchResults.games, ...searchResults.posts, ...searchResults.stories].length === 0 && (
              <p className="rounded-2xl bg-white/[0.06] px-3 py-3 text-sm text-frost/55">No local results yet. Try Gaming, Seoul, food, or coding.</p>
            )}
          </div>
        </div>
      )}

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
            <p className="mt-1 text-sm text-frost/55">UI-only game rooms for future social play.</p>
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

      <div className="space-y-4 px-5 py-5">
        {posts.map((post) => {
          const action = postActions[post.id];
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
              <p className="mt-4 text-sm leading-6 text-frost/80">{post.body}</p>
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
