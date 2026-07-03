import { Check, Compass, Hash } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { communities as mockCommunities } from '../../app/data';
import type { Community } from '../../app/types';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SearchBar } from '../../components/SearchBar';
import { getCommunities, joinCommunity, leaveCommunity } from '../../services/communityService';
import { CommunityDetailScreen } from './CommunityDetailScreen';

type CommunityFilter = 'all' | 'joined' | 'live' | 'culture' | 'creator';

const filters: Array<{ label: string; value: CommunityFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'Joined', value: 'joined' },
  { label: 'Live', value: 'live' },
  { label: 'Culture', value: 'culture' },
  { label: 'Creators', value: 'creator' }
];

function communityMatchesFilter(
  community: Community,
  activeFilter: CommunityFilter,
  joinedCommunities: Record<string, boolean>
) {
  if (activeFilter === 'all') {
    return true;
  }

  if (activeFilter === 'joined') {
    return Boolean(joinedCommunities[community.id]);
  }

  if (activeFilter === 'live') {
    return Boolean(community.online);
  }

  if (activeFilter === 'culture') {
    return ['Anime', 'Music', 'Football', 'Global'].includes(community.name);
  }

  return ['Coding', 'Campus', 'Gaming'].includes(community.name);
}

export function CommunitiesScreen() {
  const [communityList, setCommunityList] = useState<Community[]>(mockCommunities);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [joinedCommunities, setJoinedCommunities] = useState<Record<string, boolean>>({ co1: true, co7: true });
  const [syncStatus, setSyncStatus] = useState('');
  const [activeFilter, setActiveFilter] = useState<CommunityFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCommunity = communityList.find((community) => community.id === selectedCommunityId);
  const filteredCommunities = useMemo(
    () => {
      const query = searchQuery.trim().toLowerCase();

      return communityList.filter((community) => {
        const matchesFilter = communityMatchesFilter(community, activeFilter, joinedCommunities);
        const matchesSearch = !query || [
          community.name,
          community.topic,
          community.description,
          community.members,
          community.online
        ].filter(Boolean).some((value) => value?.toLowerCase().includes(query));

        return matchesFilter && matchesSearch;
      });
    },
    [activeFilter, communityList, joinedCommunities, searchQuery]
  );

  useEffect(() => {
    let isMounted = true;

    getCommunities().then((result) => {
      if (!isMounted) {
        return;
      }

      setCommunityList(result.data);

      if (result.error) {
        setSyncStatus('Showing local community data while live rooms connect.');
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
        setSyncStatus(nextJoined ? 'Joined locally. Live sync will follow when available.' : 'Left locally. Live sync will follow when available.');
      } else {
        setSyncStatus(nextJoined ? 'Community joined.' : 'Community left.');
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
      <ScreenHeader
        eyebrow="Rooms and groups"
        title="Communities"
        action={
          <button
            type="button"
            onClick={() => setSyncStatus('Choose a room or filter by your current interests.')}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white"
            aria-label="Community discovery hint"
          >
            <Compass size={20} />
          </button>
        }
      />
      <SearchBar placeholder="Search groups, rooms, and topics..." value={searchQuery} onChange={setSearchQuery} />

      {syncStatus && <p className="mx-4 mt-3 rounded-2xl bg-white/[0.05] px-3 py-2 text-xs leading-5 text-frost/55">{syncStatus}</p>}

      <div className="ad-scroll-x mt-4 flex gap-2 px-4">
        {filters.map((filter) => {
          const active = activeFilter === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${active ? 'bg-white text-black' : 'border border-white/10 text-zinc-500'}`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 divide-y divide-white/10">
        {filteredCommunities.map((community) => {
          const joined = Boolean(joinedCommunities[community.id]);

          return (
            <article key={community.id} className="flex min-w-0 items-center gap-3 px-4 py-3.5">
              <button
                type="button"
                onClick={() => setSelectedCommunityId(community.id)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
                aria-label={`View ${community.name} community`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-zinc-950 text-zinc-400">
                  <Hash size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="truncate font-bold text-white">{community.name}</span>
                    {joined && <Check size={14} className="shrink-0 text-[#1d9bf0]" />}
                  </span>
                  <span className="mt-0.5 line-clamp-1 text-sm leading-5 text-frost/55">{community.topic}</span>
                  <span className="mt-1 block truncate text-xs text-frost/40">
                    {community.members} members {community.online ? `/ ${community.online}` : ''}
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => toggleCommunity(community.id)}
                className={`max-w-[5.75rem] shrink-0 truncate rounded-full px-3 py-2 text-xs font-bold transition ${joined ? 'border border-white/15 text-white' : 'bg-white text-black'}`}
                aria-pressed={joined}
              >
                {joined ? 'Joined' : 'Join'}
              </button>
            </article>
          );
        })}

        {filteredCommunities.length === 0 && (
          <div className="px-4 py-6 text-center">
            <h2 className="font-bold text-white">No communities found</h2>
        <p className="mt-2 text-sm leading-6 text-frost/55">Try another tab, clear search, or search a different interest.</p>
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-black text-black">
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
