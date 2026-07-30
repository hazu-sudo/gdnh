create table if not exists public.bookmarks (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  target_name text not null default '',
  memo text not null default '',
  status text not null default 'unresolved'
    check (status in ('unresolved', 'pending', 'resolved', 'sent')),
  bookmark_date date not null,
  attachment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists bookmarks_user_date_idx
  on public.bookmarks (user_id, bookmark_date desc);

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.attachments (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  bookmark_id text not null references public.bookmarks(id) on delete cascade,
  storage_path text not null unique,
  file_name text not null,
  file_type text not null,
  file_size bigint not null,
  width integer,
  height integer,
  attached_at timestamptz not null default now()
);

alter table public.bookmarks enable row level security;
alter table public.user_settings enable row level security;
alter table public.attachments enable row level security;

create policy "Users manage their own bookmarks"
  on public.bookmarks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own settings"
  on public.user_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own attachment metadata"
  on public.attachments for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('shiori-attachments', 'shiori-attachments', false)
on conflict (id) do update set public = false;

create policy "Users upload their own shiori attachments"
  on storage.objects for insert
  with check (
    bucket_id = 'shiori-attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users read their own shiori attachments"
  on storage.objects for select
  using (
    bucket_id = 'shiori-attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users update their own shiori attachments"
  on storage.objects for update
  using (
    bucket_id = 'shiori-attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'shiori-attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users delete their own shiori attachments"
  on storage.objects for delete
  using (
    bucket_id = 'shiori-attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

do $$
begin
  alter publication supabase_realtime add table public.bookmarks;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.user_settings;
exception
  when duplicate_object then null;
end $$;

