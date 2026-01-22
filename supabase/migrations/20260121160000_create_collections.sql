create table if not exists public.collections (
  id uuid not null default gen_random_uuid(),
  name text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint collections_pkey primary key (id)
);

alter table public.collections enable row level security;

create policy "Users can view their own collections"
on public.collections
for select
to authenticated
using (
  (select auth.uid()) = user_id
);

create policy "Users can create their own collections"
on public.collections
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
);

create policy "Users can update their own collections"
on public.collections
for update
to authenticated
using (
  (select auth.uid()) = user_id
)
with check (
  (select auth.uid()) = user_id
);

create policy "Users can delete their own collections"
on public.collections
for delete
to authenticated
using (
  (select auth.uid()) = user_id
);
