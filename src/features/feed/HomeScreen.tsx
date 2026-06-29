import { Heart, MessageCircle, Radio, Repeat2, Rocket, Share2 } from 'lucide-react';
import { miniGamePreviews, posts, stories, trendingConversations } from '../../app/data';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SearchBar } from '../../components/SearchBar';

type HomeScreenProps = {
  onOpenCommunities: () => void;
};

export function HomeScreen({ onOpenCommunities }: HomeScreenProps) {
  return (
    <section className="animate-rise pb-6">
      <ScreenHeader
        eyebrow="Live network"
        title="Ace Domain"
        action={
          <button className="grid h-11 w-11 place-items-center rounded-full bg-white text-void shadow-glow" type="button">
            <Radio size={20} />
          </button>
        }
      />
      <SearchBar placeholder="Search people, worlds, games, trends..." />

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
          <Button className="mt-4 w-full" onClick={onOpenCommunities}>
            Find My Global Match
          </Button>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto px-5 [scrollbar-width:none]">
        <div className="flex gap-3">
          {stories.map((story) => (
            <div key={story.id} className="w-20 shrink-0 rounded-3xl bg-white/[0.06] p-2 text-center">
              <Avatar label={story.avatar} active={story.live} />
              <p className="mt-2 truncate text-xs font-semibold text-white">{story.name}</p>
              <p className="truncate text-[10px] text-frost/45">{story.location}</p>
            </div>
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
            <h2 className="font-bold text-white">Mini-Games Preview</h2>
            <p className="mt-1 text-sm text-frost/55">Future game hub cards, ready for Stage Two.</p>
          </div>
          <span className="rounded-full bg-aurora/15 px-3 py-1 text-xs font-bold text-aurora">Soon</span>
        </div>
        <div className="mt-4 flex gap-3 overflow-x-auto [scrollbar-width:none]">
          {miniGamePreviews.map((game) => (
            <div key={game.id} className="w-40 shrink-0 rounded-3xl bg-gradient-to-br from-white/12 to-white/[0.04] p-4">
              <p className="text-sm font-bold text-white">{game.name}</p>
              <p className="mt-2 text-xs text-frost/50">{game.genre}</p>
              <p className="mt-4 text-xs font-bold text-aurora">{game.players}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 px-5 py-5">
        {posts.map((post) => (
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
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-xs text-frost/60">
              <span className="flex items-center gap-1"><Heart size={15} /> {post.stats.likes}</span>
              <span className="flex items-center gap-1"><MessageCircle size={15} /> {post.stats.comments}</span>
              <span className="flex items-center gap-1"><Share2 size={15} /> {post.stats.shares}</span>
            </div>
          </article>
        ))}
        <div className="flex items-center justify-center gap-2 pb-3 text-xs text-frost/40">
          <Repeat2 size={14} />
          Feed optimized for fast future realtime updates
        </div>
      </div>
    </section>
  );
}
