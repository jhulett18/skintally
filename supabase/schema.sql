-- Skintally Database Schema
-- Run this in your Supabase SQL Editor

-- Packages table
create table if not exists packages (
  id              uuid default gen_random_uuid() primary key,
  client_name     text not null,
  client_email    text not null,
  package_type    text not null,
  sessions_purchased integer not null check (sessions_purchased > 0),
  sessions_used   integer not null default 0 check (sessions_used >= 0),
  expiry_date     date not null,
  booking_link    text,
  created_at      timestamptz default now()
);

-- Send log — tracks which reminders have already been sent
create table if not exists send_log (
  id              uuid default gen_random_uuid() primary key,
  package_id      uuid references packages(id) on delete cascade not null,
  reminder_days   integer not null check (reminder_days in (7, 14, 30)),
  sent_at         timestamptz default now(),
  unique(package_id, reminder_days)
);

-- Enable Row Level Security (RLS) — service role key bypasses these
alter table packages enable row level security;
alter table send_log enable row level security;

-- Index for cron query performance
create index if not exists idx_packages_expiry_date on packages(expiry_date);
create index if not exists idx_send_log_package_id on send_log(package_id);
