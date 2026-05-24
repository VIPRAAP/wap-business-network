# Supabase SQL Database Setup

To hook up your real Supabase backend, follow these simple steps to create the necessary tables in your database.

## Instructions
1. Open your [Supabase Dashboard](https://supabase.com/).
2. Select your project and navigate to the **SQL Editor** tab in the left-hand menu.
3. Click **New Query**.
4. Copy and paste the entire SQL block below into the editor, and click **Run**.

---

## SQL Script

```sql
-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY, -- Stores UID (uuid string or custom id)
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    company TEXT,
    domain TEXT,
    designation TEXT,
    experience TEXT,
    mobile TEXT,
    city TEXT,
    website TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) or permit direct operations for demo purposes
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow individual insert/update" ON public.profiles FOR ALL USING (true);


-- 2. POSTS TABLE
CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_company TEXT,
    type TEXT CHECK (type IN ('update', 'product', 'achievement', 'networking')) DEFAULT 'update',
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow insert/modify for authenticated users" ON public.posts FOR ALL USING (true);


-- 3. CONNECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.connections (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    connected_user_id TEXT NOT NULL,
    status TEXT DEFAULT 'connected',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, connected_user_id)
);

ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to connections" ON public.connections FOR SELECT USING (true);
CREATE POLICY "Allow manage connections" ON public.connections FOR ALL USING (true);


-- 4. RSVPS TABLE
CREATE TABLE IF NOT EXISTS public.rsvps (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    event_id TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    utr_number TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to RSVPs" ON public.rsvps FOR SELECT USING (true);
CREATE POLICY "Allow insert/manage RSVPs" ON public.rsvps FOR ALL USING (true);
```

---

## Supabase Settings
Once you've run this script, copy your **Project URL** and **API Anon Key** from your Supabase Project Settings (under API settings), open your local WAP app in your browser, and click the **Supabase Database Settings** gear icon in the navigation bar to paste them!
