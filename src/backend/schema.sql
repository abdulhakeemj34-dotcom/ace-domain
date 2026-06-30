create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  bio text,
  avatar_url text,
  country text,
  interests text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  image_url text,
  likes_count integer not null default 0,
  comments_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  category text,
  icon text,
  members_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.community_members (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  unique (community_id, user_id)
);

create table if not exists public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('direct', 'group')),
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_thread_members (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (thread_id, user_id)
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_chat_threads_updated_at on public.chat_threads;
create trigger set_chat_threads_updated_at
before update on public.chat_threads
for each row execute function public.set_updated_at();

create index if not exists posts_user_id_created_at_idx on public.posts (user_id, created_at desc);
create index if not exists community_members_user_id_idx on public.community_members (user_id);
create index if not exists community_members_community_id_idx on public.community_members (community_id);
create index if not exists chat_thread_members_user_id_idx on public.chat_thread_members (user_id);
create index if not exists chat_messages_thread_id_created_at_idx on public.chat_messages (thread_id, created_at);
create index if not exists notifications_user_id_created_at_idx on public.notifications (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.communities enable row level security;
alter table public.community_members enable row level security;
alter table public.chat_threads enable row level security;
alter table public.chat_thread_members enable row level security;
alter table public.chat_messages enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "Public profiles are readable" on public.profiles;
create policy "Public profiles are readable"
on public.profiles for select
using (true);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Posts are readable" on public.posts;
create policy "Posts are readable"
on public.posts for select
using (true);

drop policy if exists "Users can create own posts" on public.posts;
create policy "Users can create own posts"
on public.posts for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own posts" on public.posts;
create policy "Users can update own posts"
on public.posts for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own posts" on public.posts;
create policy "Users can delete own posts"
on public.posts for delete
using (auth.uid() = user_id);

drop policy if exists "Communities are readable" on public.communities;
create policy "Communities are readable"
on public.communities for select
using (true);

drop policy if exists "Community memberships are readable" on public.community_members;
create policy "Community memberships are readable"
on public.community_members for select
using (true);

drop policy if exists "Users can join communities as themselves" on public.community_members;
create policy "Users can join communities as themselves"
on public.community_members for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can leave communities as themselves" on public.community_members;
create policy "Users can leave communities as themselves"
on public.community_members for delete
using (auth.uid() = user_id);

drop policy if exists "Members can read chat threads" on public.chat_threads;
create policy "Members can read chat threads"
on public.chat_threads for select
using (
  exists (
    select 1
    from public.chat_thread_members members
    where members.thread_id = chat_threads.id
      and members.user_id = auth.uid()
  )
);

drop policy if exists "Members can read thread memberships" on public.chat_thread_members;
create policy "Members can read thread memberships"
on public.chat_thread_members for select
using (auth.uid() = user_id);

drop policy if exists "Users can join threads as themselves" on public.chat_thread_members;
create policy "Users can join threads as themselves"
on public.chat_thread_members for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can leave threads as themselves" on public.chat_thread_members;
create policy "Users can leave threads as themselves"
on public.chat_thread_members for delete
using (auth.uid() = user_id);

drop policy if exists "Members can read chat messages" on public.chat_messages;
create policy "Members can read chat messages"
on public.chat_messages for select
using (
  exists (
    select 1
    from public.chat_thread_members members
    where members.thread_id = chat_messages.thread_id
      and members.user_id = auth.uid()
  )
);

drop policy if exists "Members can send own chat messages" on public.chat_messages;
create policy "Members can send own chat messages"
on public.chat_messages for insert
with check (
  auth.uid() = sender_id
  and exists (
    select 1
    from public.chat_thread_members members
    where members.thread_id = chat_messages.thread_id
      and members.user_id = auth.uid()
  )
);

drop policy if exists "Users can read own notifications" on public.notifications;
create policy "Users can read own notifications"
on public.notifications for select
using (auth.uid() = user_id);

drop policy if exists "Users can update own notifications" on public.notifications;
create policy "Users can update own notifications"
on public.notifications for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
