import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User } from 'lucide-react'
import { redirect } from 'next/navigation'
import { getAllSessions, getUserScheduledSessionIds, addSessionToSchedule } from '@/lib/dal/sessions'

async function addToScheduleAction(formData: FormData) {
    'use server'
    const sessionId = Number(formData.get('session_id'))
    if (!sessionId) return
    await addSessionToSchedule(sessionId)
    // Optionally, revalidate or redirect
}

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
                {(sessions || []).map((session: any) => {
                    const isScheduled = scheduledSessionIds.includes(session.session_id)
                    return (
                        <Card key={session.session_id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline">{session.session_tracks?.track_name}</Badge>
                                    <Badge variant="secondary">{session.session_type}</Badge>
                                </div>
                                <CardTitle className="text-lg leading-tight">
                                    {session.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {session.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Clock className="h-4 w-4 mr-2" />
                                        {session.session_date} • {session.start_time} - {session.end_time}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <User className="h-4 w-4 mr-2" />
                                        {(session.session_participants || []).map((sp: any) =>
                                            sp.participants ? `${sp.participants.first_name} ${sp.participants.last_name}` : ''
                                        ).join(', ')}
                                    </div>
                                </div>
                                {isScheduled ? (
                                    <Button className="w-full mt-2" variant="destructive" disabled>
                                        Remove from Schedule
                                    </Button>
                                ) : (
                                    <form action={addToScheduleAction}>
                                        <input type="hidden" name="session_id" value={session.session_id} />
                                        <Button className="w-full mt-2" variant="default" type="submit">
                                            Add to Schedule
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
} 