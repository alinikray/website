/*
# Fix series status check constraint
The original constraint didn't include 'completed'. This adds it.
*/

ALTER TABLE series DROP CONSTRAINT IF EXISTS series_status_check;
ALTER TABLE series ADD CONSTRAINT series_status_check CHECK (status IN ('draft', 'published', 'ongoing', 'ended', 'completed', 'archived'));
