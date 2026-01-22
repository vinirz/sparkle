-- Create questions table
create table "public"."questions" (
    "id" uuid not null default gen_random_uuid(),
    "collection_id" uuid not null references "public"."collections"("id") on delete cascade,
    "user_id" uuid not null references "auth"."users"("id") on delete cascade,
    "statement" text not null,
    "type" text not null check (type in ('objective', 'discursive')),
    "correct_answer" text not null,
    "resolution" text,
    "subject" text not null,
    "institution" text,
    "exam" text,
    "year" integer,
    "topic" text,
    "subtopic" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    primary key ("id")
);

-- Enable RLS
alter table "public"."questions" enable row level security;

-- Policies
create policy "Users can view their own questions"
on "public"."questions"
for select
using (auth.uid() = user_id);

create policy "Users can insert their own questions"
on "public"."questions"
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own questions"
on "public"."questions"
for update
using (auth.uid() = user_id);

create policy "Users can delete their own questions"
on "public"."questions"
for delete
using (auth.uid() = user_id);
