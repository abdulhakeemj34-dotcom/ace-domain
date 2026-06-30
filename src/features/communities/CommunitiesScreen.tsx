import { Compass, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { communities as mockCommunities } from '../../app/data';
import type { Community } from '../../app/types';
import { Button } from '../../components/Button';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SearchBar } from '../../components/SearchBar';
import { getCommunities, joinCommunity, leaveCommunity } from '../../services/communityService';
import { CommunityDetailScreen } from './CommunityDetailScreen';

export function CommunitiesScreen() {
  const [communityList, setCommunityList] = useState<Community[]>(mockCommunities);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [joinedCommunities, setJoinedCommunities] = useState<Record<string, boolean>>({ co1: true, co7: true });
  const [syncStatus, setSyncStatus] = useState('');

  const selectedCommunity = communityList.find((community) => community.id === selectedCommunityId);

  useEffect(() => {
    let isMounted = true;

    getCommunities().then((result) => {
      if (!isMounted) {
        return;
      }

      setCommunityList(result.data);

      if (result.error) {
        setSyncStatus('Using demo communities until Supabase data is ready.');
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleCommunity = (communityId: string) => {
    const nextJoined = !joinedCommunities[communityId];
    setJoinedCommunities((current) => ({
      ...current,
      [communityId]: nextJoined
    }));

    const syncAction = nextJoined ? joinCommunity(communityId) : leaveCommunity(communityId);
    syncAction.then((result) => {
      if (result.usingFallback) {
        setSyncStatus('Membership updated locally. Supabase auth will sync this live later.');
      } else {
        setSyncStatus(nextJoined ? 'Community joined on Supabase.' : 'Community left on Supabase.');
      }
    });
  };

  if (selectedCommunity) {
    return (
      <CommunityDetailScreen
        community={selectedCommunity}
        joined={Boolean(joinedCommunities[selectedCommunity.id])}
        onBack={() => setSelectedCommunityId(null)}
        onToggleJoin={() => toggleCommunity(selectedCommunity.id)}
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
          {syncStatus && <p className="mt-3 text-xs leading-5 text-frost/45">{syncStatus}</p>}
        </div>

        <div className="mt-5 grid gap-3">
          {communityList.map((community) => (
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
                  aria-label={`View ${community.name} community`}
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
