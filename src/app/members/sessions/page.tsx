import { getAllSessions, getUserScheduledSessionIds } from '@/lib/dal/sessions'
import SessionCard from './SessionCard'

export default async function SessionsPage() {
    let sessions: any[] = []
    let scheduledSessionIds: number[] = []
    try {
        sessions = await getAllSessions()
        scheduledSessionIds = await getUserScheduledSessionIds()
    } catch (err: any) {
        return <div className="container mx-auto px-4 py-8">Failed to load sessions: {err.message}</div>
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Sessions</h1>
                <p className="text-lg text-gray-600">
                    Discover and schedule conference sessions that match your interests
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(sessions || []).map((session: any) => (
                    <SessionCard
                        key={session.session_id}
                        session={session}
                        isScheduled={scheduledSessionIds.includes(session.session_id)}
                    />
                ))}
            </div>
        </div>
    )
} 