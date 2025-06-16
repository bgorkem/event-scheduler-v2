
export type Database = {
    public: {
        Tables: {
            conferences: {
                Row: {
                    conference_id: number
                    name: string
                    location: string | null
                    start_date: string | null
                    end_date: string | null
                    url: string | null
                    description: string | null
                }
                Insert: {
                    conference_id?: number
                    name: string
                    location?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    url?: string | null
                    description?: string | null
                }
                Update: {
                    conference_id?: number
                    name?: string
                    location?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    url?: string | null
                    description?: string | null
                }
            }
            session_tracks: {
                Row: {
                    track_id: number
                    track_name: string
                    description: string | null
                }
                Insert: {
                    track_id?: number
                    track_name: string
                    description?: string | null
                }
                Update: {
                    track_id?: number
                    track_name?: string
                    description?: string | null
                }
            }
            participants: {
                Row: {
                    participant_id: number
                    first_name: string
                    last_name: string | null
                    organization: string | null
                    email: string | null
                    bio: string | null
                }
                Insert: {
                    participant_id?: number
                    first_name: string
                    last_name?: string | null
                    organization?: string | null
                    email?: string | null
                    bio?: string | null
                }
                Update: {
                    participant_id?: number
                    first_name?: string
                    last_name?: string | null
                    organization?: string | null
                    email?: string | null
                    bio?: string | null
                }
            }
            sessions: {
                Row: {
                    session_id: number
                    conference_id: number
                    track_id: number | null
                    title: string
                    description: string | null
                    session_date: string | null
                    start_time: string | null
                    end_time: string | null
                    session_type: string | null
                    session_url: string | null
                }
                Insert: {
                    session_id?: number
                    conference_id: number
                    track_id?: number | null
                    title: string
                    description?: string | null
                    session_date?: string | null
                    start_time?: string | null
                    end_time?: string | null
                    session_type?: string | null
                    session_url?: string | null
                }
                Update: {
                    session_id?: number
                    conference_id?: number
                    track_id?: number | null
                    title?: string
                    description?: string | null
                    session_date?: string | null
                    start_time?: string | null
                    end_time?: string | null
                    session_type?: string | null
                    session_url?: string | null
                }
            }
            session_participants: {
                Row: {
                    session_id: number
                    participant_id: number
                    role: string | null
                }
                Insert: {
                    session_id: number
                    participant_id: number
                    role?: string | null
                }
                Update: {
                    session_id?: number
                    participant_id?: number
                    role?: string | null
                }
            }
        }
    }
} 