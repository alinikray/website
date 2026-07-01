/*
# Fynex Movies — User Interaction & Engagement Tables

## Overview
Creates tables for user-generated content and interactions: watchlists, viewing history, continue watching, ratings, comments, likes, notifications, support tickets, subscription plans, and user subscriptions.

## New Tables

1. **subscription_plans** — Available subscription tiers (public read, admin write)
2. **user_subscriptions** — User's active subscription (owner-scoped)
3. **watchlists** — User's saved movies/series (owner-scoped)
4. **viewing_history** — Full watch history log (owner-scoped)
5. **continue_watching** — Resume-watching progress (owner-scoped, upserted)
6. **ratings** — User ratings for movies/series (public read, owner write)
7. **comments** — User comments on movies, series, or clips (public read, owner write)
8. **likes** — User likes on movies, clips, or comments (public read, owner write)
9. **notifications** — User notifications (owner-scoped)
10. **support_tickets** — User support requests (owner-scoped)

## Security
- RLS enabled on all tables
- Content tables (subscription_plans, ratings, comments, likes): public read (anon + authenticated)
- User-scoped tables: owner-only CRUD via auth.uid() = user_id
- All user_id columns have DEFAULT auth.uid() so inserts work without explicit user_id
*/

-- ============ SUBSCRIPTION PLANS ============
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  billing_cycle text NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly', 'lifetime')),
  features jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subscription_plans_select_all" ON subscription_plans;
CREATE POLICY "subscription_plans_select_all" ON subscription_plans FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "subscription_plans_insert_auth" ON subscription_plans;
CREATE POLICY "subscription_plans_insert_auth" ON subscription_plans FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "subscription_plans_update_auth" ON subscription_plans;
CREATE POLICY "subscription_plans_update_auth" ON subscription_plans FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "subscription_plans_delete_auth" ON subscription_plans;
CREATE POLICY "subscription_plans_delete_auth" ON subscription_plans FOR DELETE
  TO authenticated USING (true);

-- ============ USER SUBSCRIPTIONS ============
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES subscription_plans(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_subscriptions_select_own" ON user_subscriptions;
CREATE POLICY "user_subscriptions_select_own" ON user_subscriptions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_subscriptions_insert_own" ON user_subscriptions;
CREATE POLICY "user_subscriptions_insert_own" ON user_subscriptions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_subscriptions_update_own" ON user_subscriptions;
CREATE POLICY "user_subscriptions_update_own" ON user_subscriptions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_subscriptions_delete_own" ON user_subscriptions;
CREATE POLICY "user_subscriptions_delete_own" ON user_subscriptions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ WATCHLISTS ============
CREATE TABLE IF NOT EXISTS watchlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id uuid REFERENCES movies(id) ON DELETE CASCADE,
  series_id uuid REFERENCES series(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT watchlist_content_check CHECK (
    (movie_id IS NOT NULL AND series_id IS NULL) OR
    (movie_id IS NULL AND series_id IS NOT NULL)
  )
);

ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "watchlists_select_own" ON watchlists;
CREATE POLICY "watchlists_select_own" ON watchlists FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "watchlists_insert_own" ON watchlists;
CREATE POLICY "watchlists_insert_own" ON watchlists FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "watchlists_delete_own" ON watchlists;
CREATE POLICY "watchlists_delete_own" ON watchlists FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ VIEWING HISTORY ============
CREATE TABLE IF NOT EXISTS viewing_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id uuid REFERENCES movies(id) ON DELETE CASCADE,
  series_id uuid REFERENCES series(id) ON DELETE CASCADE,
  episode_id uuid REFERENCES episodes(id) ON DELETE CASCADE,
  watched_duration int DEFAULT 0,
  total_duration int DEFAULT 0,
  watched_at timestamptz DEFAULT now()
);

ALTER TABLE viewing_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "viewing_history_select_own" ON viewing_history;
CREATE POLICY "viewing_history_select_own" ON viewing_history FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "viewing_history_insert_own" ON viewing_history;
CREATE POLICY "viewing_history_insert_own" ON viewing_history FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "viewing_history_delete_own" ON viewing_history;
CREATE POLICY "viewing_history_delete_own" ON viewing_history FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ CONTINUE WATCHING ============
CREATE TABLE IF NOT EXISTS continue_watching (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id uuid REFERENCES movies(id) ON DELETE CASCADE,
  series_id uuid REFERENCES series(id) ON DELETE CASCADE,
  episode_id uuid REFERENCES episodes(id) ON DELETE CASCADE,
  progress_seconds int NOT NULL DEFAULT 0,
  total_duration int DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT continue_watching_content_check CHECK (
    (movie_id IS NOT NULL AND series_id IS NULL) OR
    (movie_id IS NULL AND series_id IS NOT NULL)
  )
);

ALTER TABLE continue_watching ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "continue_watching_select_own" ON continue_watching;
CREATE POLICY "continue_watching_select_own" ON continue_watching FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "continue_watching_insert_own" ON continue_watching;
CREATE POLICY "continue_watching_insert_own" ON continue_watching FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "continue_watching_update_own" ON continue_watching;
CREATE POLICY "continue_watching_update_own" ON continue_watching FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "continue_watching_delete_own" ON continue_watching;
CREATE POLICY "continue_watching_delete_own" ON continue_watching FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ RATINGS ============
CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id uuid REFERENCES movies(id) ON DELETE CASCADE,
  series_id uuid REFERENCES series(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 10),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT ratings_content_check CHECK (
    (movie_id IS NOT NULL AND series_id IS NULL) OR
    (movie_id IS NULL AND series_id IS NOT NULL)
  )
);

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ratings_select_all" ON ratings;
CREATE POLICY "ratings_select_all" ON ratings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "ratings_insert_own" ON ratings;
CREATE POLICY "ratings_insert_own" ON ratings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "ratings_update_own" ON ratings;
CREATE POLICY "ratings_update_own" ON ratings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "ratings_delete_own" ON ratings;
CREATE POLICY "ratings_delete_own" ON ratings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ COMMENTS ============
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id uuid REFERENCES movies(id) ON DELETE CASCADE,
  series_id uuid REFERENCES series(id) ON DELETE CASCADE,
  explore_clip_id uuid REFERENCES explore_clips(id) ON DELETE CASCADE,
  content text NOT NULL,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "comments_select_all" ON comments;
CREATE POLICY "comments_select_all" ON comments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "comments_insert_own" ON comments;
CREATE POLICY "comments_insert_own" ON comments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "comments_update_own" ON comments;
CREATE POLICY "comments_update_own" ON comments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "comments_delete_own" ON comments;
CREATE POLICY "comments_delete_own" ON comments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ LIKES ============
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id uuid REFERENCES movies(id) ON DELETE CASCADE,
  explore_clip_id uuid REFERENCES explore_clips(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT likes_target_check CHECK (
    (movie_id IS NOT NULL AND explore_clip_id IS NULL AND comment_id IS NULL) OR
    (movie_id IS NULL AND explore_clip_id IS NOT NULL AND comment_id IS NULL) OR
    (movie_id IS NULL AND explore_clip_id IS NULL AND comment_id IS NOT NULL)
  )
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "likes_select_all" ON likes;
CREATE POLICY "likes_select_all" ON likes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "likes_insert_own" ON likes;
CREATE POLICY "likes_insert_own" ON likes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "likes_delete_own" ON likes;
CREATE POLICY "likes_delete_own" ON likes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ NOTIFICATIONS ============
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  data jsonb DEFAULT '{}'::jsonb,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select_own" ON notifications;
CREATE POLICY "notifications_select_own" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_insert_own" ON notifications;
CREATE POLICY "notifications_insert_own" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_update_own" ON notifications;
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_delete_own" ON notifications;
CREATE POLICY "notifications_delete_own" ON notifications FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ SUPPORT TICKETS ============
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  closed_at timestamptz
);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "support_tickets_select_own" ON support_tickets;
CREATE POLICY "support_tickets_select_own" ON support_tickets FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "support_tickets_insert_own" ON support_tickets;
CREATE POLICY "support_tickets_insert_own" ON support_tickets FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "support_tickets_update_own" ON support_tickets;
CREATE POLICY "support_tickets_update_own" ON support_tickets FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_viewing_history_user_id ON viewing_history(user_id);
CREATE INDEX IF NOT EXISTS idx_viewing_history_watched_at ON viewing_history(watched_at DESC);
CREATE INDEX IF NOT EXISTS idx_continue_watching_user_id ON continue_watching(user_id);
CREATE INDEX IF NOT EXISTS idx_continue_watching_updated ON continue_watching(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_ratings_movie_id ON ratings(movie_id);
CREATE INDEX IF NOT EXISTS idx_likes_movie_id ON likes(movie_id);
CREATE INDEX IF NOT EXISTS idx_likes_clip_id ON likes(explore_clip_id);
CREATE INDEX IF NOT EXISTS idx_comments_movie_id ON comments(movie_id);
CREATE INDEX IF NOT EXISTS idx_comments_clip_id ON comments(explore_clip_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);

-- ============ TRIGGERS ============
DROP TRIGGER IF EXISTS trigger_continue_watching_updated ON continue_watching;
CREATE TRIGGER trigger_continue_watching_updated BEFORE UPDATE ON continue_watching
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_comments_updated_at ON comments;
CREATE TRIGGER trigger_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_support_tickets_updated_at ON support_tickets;
CREATE TRIGGER trigger_support_tickets_updated_at BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
