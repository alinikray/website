/*
# Fynex Movies — Triggers & Auto-Profile on Signup

## Overview
1. Creates a reusable `update_updated_at()` trigger function that sets
   `updated_at = now()` on row update.
2. Attaches BEFORE UPDATE triggers to all tables with an `updated_at` column:
   profiles, movies, series.
3. Creates `handle_new_user()` — a SECURITY DEFINER trigger function that
   auto-inserts a `profiles` row when a new auth.users row is created (signup),
   deriving username from the email local-part if not provided in user metadata.
4. Attaches the trigger to auth.users.

## Security
- `handle_new_user()` is SECURITY DEFINER so it can insert into profiles even
  though the new user has no session yet. It only inserts the user's own row
  (id = NEW.id), so there is no privilege escalation risk.
- The trigger is idempotent (ON CONFLICT DO NOTHING).
*/

-- ============ UPDATED_AT TRIGGER FUNCTION ============
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- profiles
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON profiles;
CREATE TRIGGER trigger_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- movies
DROP TRIGGER IF EXISTS trigger_movies_updated_at ON movies;
CREATE TRIGGER trigger_movies_updated_at BEFORE UPDATE ON movies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- series
DROP TRIGGER IF EXISTS trigger_series_updated_at ON series;
CREATE TRIGGER trigger_series_updated_at BEFORE UPDATE ON series
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============ AUTO-CREATE PROFILE ON SIGNUP ============
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
