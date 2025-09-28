-- Migration: Add conflict detection to user_scheduled_sessions
-- Date: 2025-09-28
-- Description: Adds has_conflict column and automatic conflict detection system

-- Add has_conflict column to user_scheduled_sessions table
ALTER TABLE user_scheduled_sessions 
ADD COLUMN IF NOT EXISTS has_conflict BOOLEAN DEFAULT FALSE;

-- Create an index for better performance on conflict queries
CREATE INDEX IF NOT EXISTS idx_user_scheduled_sessions_has_conflict 
ON user_scheduled_sessions(has_conflict) WHERE has_conflict = TRUE;

-- Function to detect and update scheduling conflicts for a user
CREATE OR REPLACE FUNCTION update_user_scheduling_conflicts(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- First, reset all conflicts for the user
    UPDATE user_scheduled_sessions 
    SET has_conflict = FALSE 
    WHERE user_id = target_user_id;

    -- Then mark sessions that have conflicts
    UPDATE user_scheduled_sessions 
    SET has_conflict = TRUE
    WHERE user_id = target_user_id
    AND id IN (
        SELECT DISTINCT uss1.id
        FROM user_scheduled_sessions uss1
        JOIN sessions s1 ON uss1.session_id = s1.session_id
        JOIN user_scheduled_sessions uss2 ON uss1.user_id = uss2.user_id
        JOIN sessions s2 ON uss2.session_id = s2.session_id
        WHERE uss1.user_id = target_user_id
        AND uss1.id != uss2.id  -- Don't compare session with itself
        AND s1.session_date = s2.session_date  -- Same date
        AND (
            -- Check for time overlaps
            (s1.start_time < s2.end_time AND s1.end_time > s2.start_time)
        )
    );
END;
$$;

-- Function to be called after insert/update/delete on user_scheduled_sessions
CREATE OR REPLACE FUNCTION trigger_update_conflicts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Handle different trigger operations
    IF TG_OP = 'DELETE' THEN
        PERFORM update_user_scheduling_conflicts(OLD.user_id);
        RETURN OLD;
    ELSE
        PERFORM update_user_scheduling_conflicts(NEW.user_id);
        RETURN NEW;
    END IF;
END;
$$;

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS user_scheduled_sessions_conflict_trigger ON user_scheduled_sessions;
CREATE TRIGGER user_scheduled_sessions_conflict_trigger
    AFTER INSERT OR UPDATE OR DELETE ON user_scheduled_sessions
    FOR EACH ROW EXECUTE FUNCTION trigger_update_conflicts();

-- Update existing data to check for conflicts (if any)
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN 
        SELECT DISTINCT user_id 
        FROM user_scheduled_sessions 
    LOOP
        PERFORM update_user_scheduling_conflicts(user_record.user_id);
    END LOOP;
END $$;