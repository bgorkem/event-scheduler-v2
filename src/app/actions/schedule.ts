'use server'

import { addSessionToSchedule, removeSessionFromSchedule } from '@/lib/dal/sessions'

export async function toggleScheduleSessionAction(prevState: { isScheduled: boolean }, formData: FormData): Promise<{ isScheduled: boolean }> {
    const sessionId = Number(formData.get('session_id'))
    if (!sessionId) return { isScheduled: false }
    // Import addSessionToSchedule from the correct location
    if (prevState.isScheduled) {
        await removeSessionFromSchedule(sessionId)
        return { isScheduled: false }
    } else {
        await addSessionToSchedule(sessionId)
        return { isScheduled: true }
    }
}

