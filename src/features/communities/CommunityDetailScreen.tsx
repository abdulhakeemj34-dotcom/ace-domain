import { ArrowLeft, Check, UsersRound } from 'lucide-react';
import { communityMembers, communityPosts } from '../../app/data';
import type { Community } from '../../app/types';
import { Avatar } from '../../components/Avatar';
import { TranslationToggle } from '../../components/language/TranslationToggle';

type CommunityDetailScreenProps = {
  community: Community;
  joined: boolean;
  onBack: () => void;
  onToggleJoin: () => void;
};

export function CommunityDetailScreen({ community, joined, onBack, onToggleJoin }: CommunityDetailScreenProps) {
  const posts = communityPosts.filter((post) => post.communityId === community.id);
  const members = communityMembers.filter((member) => member.communityId === community.id);

  return (
    <section className="animate-rise pb-8">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/95 px-4 pb-3 pt-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white" aria-label="Back to communities">
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-frost/45">Community</p>
            <h1 className="truncate text-xl font-black text-white">{community.name}</h1>
          </div>
          <button
            type="button"
            onClick={onToggleJoin}
            className={`flex h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-bold transition ${
              joined ? 'border border-white/15 text-white' : 'bg-white text-black'
            }`}
            aria-pressed={joined}
          >
            {joined && <Check size={16} />}
            {joined ? 'Joined' : 'Join'}
          </button>
        </div>
      </header>

      <div className="border-b border-white/10 px-4 py-4">
        <TranslationToggle
          className="text-sm leading-6"
          text={community.description ?? community.topic}
          translatedText={`Translation preview: ${community.description ?? community.topic}`}
        />
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-frost/55">
          <span className="rounded-full border border-white/10 px-3 py-1">{community.members} members</span>
          {community.online && <span className="rounded-full border border-white/10 px-3 py-1">{community.online}</span>}
          <span className="rounded-full border border-white/10 px-3 py-1 text-zinc-400">
            {community.topic.split(',')[0]}
          </span>
        </div>
      </div>

      <div className="border-b border-white/10 px-4 py-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-bold text-white">Members</h2>
          <UsersRound className="text-zinc-400" size={18} />
        </div>
        <div className="flex gap-3 overflow-x-auto [scrollbar-width:none]">
          {members.map((member) => (
            <div key={member.id} className="w-20 shrink-0 text-center">
              <Avatar label={member.avatar} active />
              <p className="mt-2 truncate text-sm font-bold text-white">{member.name}</p>
              <p className="truncate text-xs text-frost/45">{member.role}</p>
            </div>
          ))}
          {members.length === 0 && (
            <p className="text-sm leading-6 text-zinc-500">
              Member previews will appear here when live community data is available.
            </p>
          )}
        </div>
      </div>

      <div className="divide-y divide-white/10">
        <h2 className="px-4 py-3 text-sm font-bold uppercase tracking-[0.22em] text-frost/45">Posts</h2>
        {posts.length === 0 && (
          <div className="px-4 py-6">
            <h3 className="font-bold text-white">No posts here yet</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              This room is ready for live posts once the community feed is connected.
            </p>
          </div>
        )}
        {posts.map((post) => (
          <article key={post.id} className="px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="truncate font-bold text-white">{post.author}</h3>
              <span className="shrink-0 text-xs text-frost/45">{post.time}</span>
            </div>
            <TranslationToggle
              className="mt-2 text-sm leading-6"
              text={post.body}
              translatedText={`Translation preview: ${post.body}`}
            />
            <p className="mt-3 text-xs font-bold text-frost/45">{post.reactions} reactions</p>
          </article>
        ))}
      </div>
    </section>
  );
}
