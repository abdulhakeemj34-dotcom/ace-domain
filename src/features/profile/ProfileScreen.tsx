import { BadgeCheck, MapPin, Settings } from 'lucide-react';
import { futureModules } from '../../app/data';
import { Avatar } from '../../components/Avatar';
import { ScreenHeader } from '../../components/ScreenHeader';

const stats = [
  { label: 'Friends', value: '18.2K' },
  { label: 'Posts', value: '248' },
  { label: 'Groups', value: '36' }
];

const interests = ['Gaming', 'Music', 'Coding', 'Travel', 'Anime'];

export function ProfileScreen() {
  return (
    <section className="animate-rise pb-6">
      <ScreenHeader
        eyebrow="World ID"
        title="Profile"
        action={
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white">
            <Settings size={20} />
          </button>
        }
      />
      <div className="px-5 py-5">
        <div className="glass-panel rounded-[34px] p-5 text-center">
          <div className="mx-auto w-fit">
            <Avatar label="AD" size="lg" active />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <h2 className="text-2xl font-black text-white">Ace Explorer</h2>
            <BadgeCheck size={20} className="text-aurora" />
          </div>
          <p className="mt-1 flex items-center justify-center gap-1 text-sm text-frost/55">
            <MapPin size={14} /> Lagos / Worldwide
          </p>
          <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-frost/65">
            Building friendships, communities, and opportunities across borders.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {interests.map((interest) => (
              <span key={interest} className="rounded-full bg-aurora/10 px-3 py-1 text-xs font-semibold text-aurora">
                {interest}
              </span>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white/[0.06] p-3">
                <p className="text-lg font-black text-white">{stat.value}</p>
                <p className="text-xs text-frost/45">{stat.label}</p>
              </div>
            ))}
          </div>
          <button type="button" className="mt-5 w-full rounded-full bg-white px-5 py-3 text-sm font-bold text-void">
            Edit Profile
          </button>
        </div>

        <div className="mt-5 rounded-[28px] border border-white/10 bg-white/[0.05] p-4">
          <h3 className="font-bold text-white">Future-ready architecture</h3>
          <p className="mt-2 text-sm leading-6 text-frost/55">
            These modules are reserved in the product roadmap, separate from the Version 1 social layer.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {futureModules.map((module) => (
              <span key={module} className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-frost/65">
                {module}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
