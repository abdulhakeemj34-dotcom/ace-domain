import { Compass, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { communities } from '../../app/data';
import { Button } from '../../components/Button';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SearchBar } from '../../components/SearchBar';
import { CommunityDetailScreen } from './CommunityDetailScreen';

export function CommunitiesScreen() {
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [joinedCommunities, setJoinedCommunities] = useState<Record<string, boolean>>({ co1: true, co7: true });

  const selectedCommunity = communities.find((community) => community.id === selectedCommunityId);

  if (selectedCommunity) {
    return (
      <CommunityDetailScreen
        community={selectedCommunity}
        joined={Boolean(joinedCommunities[selectedCommunity.id])}
        onBack={() => setSelectedCommunityId(null)}
        onToggleJoin={() =>
          setJoinedCommunities((current) => ({
            ...current,
            [selectedCommunity.id]: !current[selectedCommunity.id]
          }))
        }
      />
    );
  }

  return (
    <section className="animate-rise pb-6">
      <ScreenHeader eyebrow="Interest planets" title="Communities" />
      <SearchBar placeholder="Ask Ace AI to find communities for your vibe..." />
      <div className="px-5 py-5">
        <div className="glass-panel rounded-[30px] p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-aurora text-void">
              <Compass size={22} />
            </div>
            <div>
              <h2 className="font-bold text-white">Global Match Hub</h2>
              <p className="text-sm text-frost/60">People, rooms, and groups tuned to your interests.</p>
            </div>
          </div>
          <Button className="mt-4 w-full">Start Matching Worldwide</Button>
        </div>

        <div className="mt-5 grid gap-3">
          {communities.map((community) => (
            <article key={community.id} className="rounded-[28px] border border-white/10 bg-white/[0.06] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{community.name}</h3>
                  <p className="mt-1 text-sm text-frost/55">{community.topic}</p>
                </div>
                <Sparkles style={{ color: community.accent }} size={20} />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-frost/70">{community.members} members</span>
                <button
                  type="button"
                  onClick={() => setSelectedCommunityId(community.id)}
                  className="rounded-full bg-white px-4 py-2 text-xs font-bold text-void"
                >
                  View
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
