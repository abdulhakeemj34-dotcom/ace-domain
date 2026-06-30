import { ArrowLeft, Check, Sparkles, UsersRound } from 'lucide-react';
import type { Community } from '../../app/types';
import { communityMembers, communityPosts } from '../../app/data';
import { Avatar } from '../../components/Avatar';

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
      <header className="px-5 pb-4 pt-8">
        <button type="button" onClick={onBack} className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white">
          <ArrowLeft size={20} />
        </button>
        <div className="rounded-[34px] border border-white/10 bg-white/[0.06] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-aurora">Community world</p>
              <h1 className="mt-2 text-3xl font-black text-white">{community.name}</h1>
              <p className="mt-2 text-sm leading-6 text-frost/60">{community.description}</p>
            </div>
            <Sparkles style={{ color: community.accent }} size={26} />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/[0.06] p-3">
              <p className="text-lg font-black text-white">{community.members}</p>
              <p className="text-xs text-frost/45">Members</p>
            </div>
            <div className="rounded-2xl bg-white/[0.06] p-3">
              <p className="text-lg font-black text-white">{community.online}</p>
              <p className="text-xs text-frost/45">Active now</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleJoin}
            className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition ${
              joined ? 'bg-aurora/15 text-aurora' : 'bg-white text-void'
            }`}
          >
            {joined && <Check size={17} />}
            {joined ? 'Joined' : 'Join Community'}
          </button>
        </div>
      </header>

      <div className="px-5">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-white">Members preview</h2>
              <p className="text-sm text-frost/50">People shaping this world.</p>
            </div>
            <UsersRound className="text-aurora" size={20} />
          </div>
          <div className="grid gap-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center gap-3 rounded-3xl bg-white/[0.06] p-3">
                <Avatar label={member.avatar} active />
                <div>
                  <p className="text-sm font-bold text-white">{member.name}</p>
                  <p className="text-xs text-frost/45">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-frost/50">Community posts</h2>
          {posts.map((post) => (
            <article key={post.id} className="rounded-[26px] border border-white/10 bg-white/[0.06] p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-white">{post.author}</h3>
                <span className="text-xs text-aurora">{post.time}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-frost/65">{post.body}</p>
              <p className="mt-3 text-xs font-bold text-frost/45">{post.reactions} reactions</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
