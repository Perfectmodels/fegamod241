-- Minimal schema for Neon Postgres
create table if not exists public.members (
  id text primary key,
  name text not null,
  category text not null,
  bio text not null,
  image_url text not null,
  socials jsonb
);

create table if not exists public.events (
  id text primary key,
  title text not null,
  date text not null,
  location text not null,
  description text not null,
  image_url text not null
);

create table if not exists public.articles (
  id text primary key,
  title text not null,
  excerpt text not null,
  content text not null,
  image_url text not null,
  category text not null,
  date text not null
);

create table if not exists public.founders (
  id text primary key,
  name text not null,
  title text not null,
  image_url text not null
);

create table if not exists public.partners (
  id text primary key,
  name text not null,
  logo_url text not null
);

create table if not exists public.settings (
  id int primary key default 1,
  email text not null,
  phone text not null,
  address text not null
);

create table if not exists public.full_members_data (
  id text primary key,
  name text not null,
  gender text not null,
  email text not null,
  phone text not null,
  age_range text not null,
  nationality text not null,
  city text not null,
  association text not null,
  category text not null,
  revenue text not null
);


