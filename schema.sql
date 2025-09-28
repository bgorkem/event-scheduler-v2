-- Database Schema for Event Scheduler Application
-- Complete DDL for Supabase deployment
-- Version: 2.0 (Updated with conflict detection and complete RLS policies)
-- 
-- Features:
-- - User authentication integration with Supabase auth.users
-- - Automatic scheduling conflict detection
-- - Row Level Security (RLS) for data protection
-- - Performance optimized with proper indexing
-- - Automatic timestamp management

-- Table for Conferences
CREATE TABLE conferences (
    conference_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date DATE,
    end_date DATE,
    url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Session Tracks (e.g., "Artificial Intelligence", "Data Engineering and Streaming")
CREATE TABLE session_tracks (
    track_id SERIAL PRIMARY KEY,
    track_name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Participants (e.g., speakers, attendees, etc.)
CREATE TABLE participants (
    participant_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    organization VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (first_name, last_name, organization) -- Added for robustness to identify unique individuals
);

-- Table for Sessions
CREATE TABLE sessions (
    session_id SERIAL PRIMARY KEY,
    conference_id INT NOT NULL,
    track_id INT, -- Link to session_tracks
    title VARCHAR(500) NOT NULL,
    description TEXT,
    session_date DATE,
    start_time TIME,
    end_time TIME,
    session_type VARCHAR(100), -- e.g., 'Keynote', 'Presentation', 'Demo', 'Panel'
    session_url TEXT, -- URL link to the original session page
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conference_id) REFERENCES conferences(conference_id) ON DELETE CASCADE,
    FOREIGN KEY (track_id) REFERENCES session_tracks(track_id) ON DELETE SET NULL
);

-- Junction table for many-to-many relationship between sessions and participants
CREATE TABLE session_participants (
    session_id INT NOT NULL,
    participant_id INT NOT NULL,
    role VARCHAR(100), -- e.g., 'Speaker', 'Moderator', 'Panelist'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (session_id, participant_id),
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES participants(participant_id) ON DELETE CASCADE
);

-- Table for user scheduled sessions - linking authenticated users to sessions they want to attend
CREATE TABLE user_scheduled_sessions (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id INT NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    has_conflict BOOLEAN DEFAULT FALSE, -- Indicates if this session conflicts with other scheduled sessions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, session_id)
);

-- Enable Row Level Security
ALTER TABLE conferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_scheduled_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Conferences: Allow read access to all authenticated users
CREATE POLICY "Allow read access to conferences" ON conferences
    FOR SELECT USING (true);

-- Session tracks: Allow read access to all authenticated users
CREATE POLICY "Allow read access to session_tracks" ON session_tracks
    FOR SELECT USING (true);

-- Participants: Allow read access to all authenticated users
CREATE POLICY "Allow read access to participants" ON participants
    FOR SELECT USING (true);

-- Sessions: Allow read access to all authenticated users
CREATE POLICY "Allow read access to sessions" ON sessions
    FOR SELECT USING (true);

-- Session participants: Allow read access to all authenticated users
CREATE POLICY "Allow read access to session_participants" ON session_participants
    FOR SELECT USING (true);

-- User scheduled sessions: Users can only access their own scheduled sessions
CREATE POLICY "Users can manage their own scheduled sessions" ON user_scheduled_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX idx_sessions_conference_id ON sessions(conference_id);
CREATE INDEX idx_sessions_track_id ON sessions(track_id);
CREATE INDEX idx_sessions_date ON sessions(session_date);
CREATE INDEX idx_sessions_time ON sessions(start_time, end_time);
CREATE INDEX idx_session_participants_session_id ON session_participants(session_id);
CREATE INDEX idx_session_participants_participant_id ON session_participants(participant_id);
CREATE INDEX idx_user_scheduled_sessions_user_id ON user_scheduled_sessions(user_id);
CREATE INDEX idx_user_scheduled_sessions_session_id ON user_scheduled_sessions(session_id);
CREATE INDEX idx_user_scheduled_sessions_has_conflict ON user_scheduled_sessions(has_conflict) WHERE has_conflict = TRUE;

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updating timestamps
CREATE TRIGGER update_conferences_updated_at BEFORE UPDATE ON conferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_session_tracks_updated_at BEFORE UPDATE ON session_tracks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_participants_updated_at BEFORE UPDATE ON participants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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