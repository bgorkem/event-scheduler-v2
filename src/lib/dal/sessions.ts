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
