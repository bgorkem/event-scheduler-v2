import { createClient } from '@/lib/supabase/server'

export async function getScheduledSessions() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user session found')

    const { data, error } = await supabase
        .from('user_scheduled_sessions')
        .select('session_id, sessions(*), has_conflict')
        .eq('user_id', user.id)

    if (error) throw new Error(error.message)
    return data || []
}

export async function getAllSessions() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('sessions')
        .select(`
            session_id, title, description, session_date, start_time, end_time, session_type,
            track_id, session_tracks(track_name),
            session_participants(participant_id, participants(first_name, last_name))
        `)
        .order('session_date', { ascending: true })
        .order('start_time', { ascending: true })
    if (error) throw new Error(error.message)
    return data || []
}

export async function getUserScheduledSessionIds() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
    const { data, error } = await supabase
        .from('user_scheduled_sessions')
        .select('session_id')
        .eq('user_id', user.id)
    if (error) return []
    return (data || []).map((row: any) => row.session_id)
}

export async function addSessionToSchedule(sessionId: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user session found')
    
    // Check if already scheduled to avoid unique constraint errors
    const { data: existingSchedule } = await supabase
        .from('user_scheduled_sessions')
        .select('id')
        .eq('user_id', user.id)
        .eq('session_id', sessionId)
        .single()
    
    if (existingSchedule) {
        return true // Already scheduled, no need to insert again
    }
    
    const { error } = await supabase
        .from('user_scheduled_sessions')
        .insert([{ user_id: user.id, session_id: sessionId }])
    
    if (error) {
        console.error('Error adding session to schedule:', error)
        throw new Error(error.message)
    }
    return true
}

export async function removeSessionFromSchedule(sessionId: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user session found')
    
    const { error } = await supabase
        .from('user_scheduled_sessions')
        .delete()
        .eq('user_id', user.id)
        .eq('session_id', sessionId)
    
    if (error) {
        console.error('Error removing session from schedule:', error)
        throw new Error(error.message)
    }
    return true
}
