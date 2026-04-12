# What inside? <br/> <sub> https://28-jotion-clone.vercel.app/ </sub>

![work in progress](https://i.imgur.com/cW9GVNg.png)

<br/>
<br/>
<br/>

## Database Setup - utm_stats Table

This project shares the `utm_stats` table with projects: 14_portfolio, 23_store, and 29_ai-companion.

```sql
-- =================================== 📊 utm_stats table (SHARED across 14, 23, 28, 29) ===================================
-- Unified UTM tracking across all portfolio projects

CREATE TABLE IF NOT EXISTS public.utm_stats (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id     TEXT NOT NULL,
  source      TEXT,
  medium      TEXT,
  campaign    TEXT,
  url         TEXT,
  user_agent  TEXT
);

CREATE INDEX IF NOT EXISTS idx_utm_stats_created_at ON public.utm_stats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_utm_stats_user_id    ON public.utm_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_utm_stats_source     ON public.utm_stats(source);
CREATE INDEX IF NOT EXISTS idx_utm_stats_campaign   ON public.utm_stats(campaign);

-- 🔐 RLS Policies
ALTER TABLE public.utm_stats ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'utm_stats' AND policyname = 'Allow select for everyone') THEN
        CREATE POLICY "Allow select for everyone" ON public.utm_stats FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'utm_stats' AND policyname = 'Allow insert for everyone') THEN
        CREATE POLICY "Allow insert for everyone" ON public.utm_stats FOR INSERT WITH CHECK (true);
    END IF;
END
$$;

ALTER TABLE public.utm_stats FORCE ROW LEVEL SECURITY;

-- ⚠️ SHARED TABLE: Projects 14_portfolio, 23_store, 28_notion-clone, 29_ai-companion use this same utm_stats table
-- All UTM tracking data is aggregated in a single shared Supabase table
```

<br/>
<br/>
<br/>

# Clone repository

## Step 1.1 - clone repository (variant 1)

![alt text](https://i.imgur.com/9KSgjaN.png)

## or Step 1.1 - clone repository (variant 2)

```
git clone https://github.com/nicitaacom/28_notion-clone
```

## Step 1.2 - install deps

```
pnpm i
```

## Step 1.3 - run project

```
pnpm dev
```

In new terminal

```
pnpx convex dev
```

<br/>
<br/>
<br/>

## Step 2 - setup .env

### 2.1 - convex - https://youtu.be/0OaDyjB9Ib8?t=4679

### 2.2 - clerk - https://youtu.be/0OaDyjB9Ib8?t=4916

### 2.3 - edge store - https://youtu.be/0OaDyjB9Ib8?t=22786

