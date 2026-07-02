/*
# Fix: handle_new_user trigger — prevent signup rollback on username/email conflict

## Problem
The `handle_new_user()` trigger inserts into `profiles` with
`ON CONFLICT (id) DO NOTHING`. But `profiles` has UNIQUE constraints on both
`email` and `username`. If a new auth user signs up with an email or username
that already exists in `profiles` (e.g., a previously-deleted auth user whose
profile row lingered, or a username collision across different email domains),
the `ON CONFLICT (id)` clause does NOT catch the conflict — the INSERT throws
a unique violation on `email` or `username`, which propagates up and rolls back
the entire `auth.users` INSERT. The signup silently fails: no user is created,
and the client receives an error.

## Fix
Rewrite the trigger to handle conflicts on `email` and `username` gracefully:
- If the email already exists, update that existing profile row to point to the
  new auth user id (re-link), or skip if the id already matches.
- If the username already exists, append a random suffix to make it unique.
- Wrap the insert in a sub-block with exception handling so any unexpected
  conflict does NOT abort the auth.users insert — the user must always be
  created even if profile creation has issues.

## Security
- Function remains SECURITY DEFINER so it can write to profiles before the
  user has a session.
- No privilege escalation: only operates on the new user's own row.
*/

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username text;
  final_username text;
  suffix int := 0;
BEGIN
  base_username := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1));
  final_username := base_username;

  -- Ensure username uniqueness before inserting
  WHILE EXISTS (SELECT 1 FROM profiles WHERE username = final_username) LOOP
    suffix := suffix + 1;
    final_username := base_username || '_' || suffix::text;
  END LOOP;

  -- Insert the profile; if the email already exists (e.g. re-signup after
  -- auth user deletion), update the existing row to relink to the new auth id.
  -- Any remaining conflict is caught so the auth.users insert is never aborted.
  BEGIN
    INSERT INTO profiles (id, email, username)
    VALUES (NEW.id, NEW.email, final_username)
    ON CONFLICT (email) DO UPDATE
      SET id = NEW.id, username = EXCLUDED.username, updated_at = now();
  EXCEPTION WHEN OTHERS THEN
    -- Never let profile creation abort the auth.users insert
    RAISE NOTICE 'handle_new_user: profile insert failed for user %, error: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
