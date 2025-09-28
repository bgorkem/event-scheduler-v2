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
DECLARE
    conflict_ids INTEGER[];
BEGIN
    -- Find all sessions that have conflicts
    SELECT ARRAY(
        SELECT DISTINCT uss1.id
        FROM user_scheduled_sessions uss1
        JOIN sessions s1 ON uss1.session_id = s1.session_id
        JOIN user_scheduled_sessions uss2 ON uss1.user_id = uss2.user_id
        JOIN sessions s2 ON uss2.session_id = s2.session_id
        WHERE uss1.user_id = target_user_id
        AND uss1.session_id != uss2.session_id  -- Compare session_ids instead of record ids
        AND s1.session_date = s2.session_date  -- Same date
        AND (
            -- Check for time overlaps
            (s1.start_time < s2.end_time AND s1.end_time > s2.start_time)
        )
    ) INTO conflict_ids;

    -- Update all records for this user in one operation to avoid multiple trigger calls
    UPDATE user_scheduled_sessions 
    SET has_conflict = CASE 
        WHEN id = ANY(COALESCE(conflict_ids, ARRAY[]::INTEGER[])) THEN TRUE 
        ELSE FALSE 
    END
    WHERE user_id = target_user_id;
END;
$$;

-- Stored procedure to add a session to user's schedule and update conflicts
CREATE OR REPLACE FUNCTION schedule_session_for_user(p_user_id UUID, p_session_id INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Insert the scheduled session (will fail if already exists due to UNIQUE constraint)
    INSERT INTO user_scheduled_sessions (user_id, session_id) 
    VALUES (p_user_id, p_session_id);
    
    -- Update conflicts for this user
    PERFORM update_user_scheduling_conflicts(p_user_id);
END;
$$;

-- Stored procedure to remove a session from user's schedule and update conflicts
CREATE OR REPLACE FUNCTION unschedule_session_for_user(p_user_id UUID, p_session_id INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Delete the scheduled session
    DELETE FROM user_scheduled_sessions 
    WHERE user_id = p_user_id AND session_id = p_session_id;
    
    -- Update conflicts for this user
    PERFORM update_user_scheduling_conflicts(p_user_id);
END;
$$;

-- Remove old trigger-based approach to prevent infinite recursion
DROP TRIGGER IF EXISTS user_scheduled_sessions_conflict_trigger ON user_scheduled_sessions;
DROP FUNCTION IF EXISTS trigger_update_conflicts();

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