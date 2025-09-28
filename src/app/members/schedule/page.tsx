"use server";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Download,
  Trash2,
  AlertTriangle,
  CalendarDays,
  CalendarRange,
  Share2,
  Plus,
} from "lucide-react";
import { getScheduledSessions } from "@/lib/dal/sessions";

export default async function SchedulePage() {
  const scheduledSessions = await getScheduledSessions();

  // Map to session objects
  const sessions = (scheduledSessions || []).map((row: any) => ({
    ...row.sessions,
    has_conflict: row.has_conflict,
  }));

  // Group sessions by date
  const sessionsByDate: Record<string, typeof sessions> = {};
  sessions.forEach((session: any) => {
    const date = session.session_date;
    if (!sessionsByDate[date]) sessionsByDate[date] = [];
    sessionsByDate[date].push(session);
  });

  // For demo, pick the first date or today
  const selectedDate =
    Object.keys(sessionsByDate)[0] || new Date().toISOString().slice(0, 10);
  const conflictSessions = sessions.filter((s: any) => s.has_conflict);

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Schedule</h1>
        <p className="text-lg text-gray-600">
          Your personalized conference schedule with {sessions.length} sessions
        </p>
      </div>

      {/* Conflict Alert */}
      {conflictSessions.length > 0 && (
        <div className="mb-6">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span className="font-medium">Schedule Conflicts Detected</span>
            </div>
            <p className="mt-1 text-sm">
              You have {conflictSessions.length} overlapping sessions. Consider
              adjusting your schedule.
            </p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="default" size="sm" disabled>
            <CalendarDays className="h-4 w-4 mr-2" />
            Day View
          </Button>
          <Button variant="outline" size="sm" disabled>
            <CalendarRange className="h-4 w-4 mr-2" />
            Week View
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={selectedDate}
            readOnly
            className="px-3 py-1 border rounded-md text-sm bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            <Download className="h-4 w-4 mr-2" />
            Google Calendar
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Download className="h-4 w-4 mr-2" />
            Export ICS
          </Button>
        </div>
      </div>

      {/* Day View */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">{formatDate(selectedDate)}</h2>
        {sessionsByDate[selectedDate]?.length ? (
          <div className="space-y-4">
            {sessionsByDate[selectedDate]
              .sort((a, b) => a.start_time.localeCompare(b.start_time))
              .map((session: any) => (
                <Card
                  key={session.session_id}
                  className={`${
                    session.has_conflict ? "border-yellow-300 bg-yellow-50" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{session.track}</Badge>
                          <Badge variant="secondary">
                            {session.session_type}
                          </Badge>
                          {session.has_conflict && (
                            <Badge
                              variant="destructive"
                              className="flex items-center gap-1"
                            >
                              <AlertTriangle className="h-3 w-3" />
                              Conflict
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">
                          {session.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {session.description}
                        </CardDescription>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatTime(session.start_time)} -{" "}
                            {formatTime(session.end_time)}
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {session.speakers?.join(", ")}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {session.organization}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" disabled>
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" disabled>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No sessions scheduled
            </h3>
            <p className="text-gray-600 mb-4">
              You don&apos;t have any sessions scheduled for this day.
            </p>
            <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              Browse Sessions
            </Button>
          </div>
        )}
      </div>
      {/* Summary Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">
              {sessions.length}
            </div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-2xl font-bold text-green-600">
              {Object.keys(sessionsByDate).length}
            </div>
            <div className="text-sm text-gray-600">Conference Days</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(sessions.map((s: any) => s.track)).size}
            </div>
            <div className="text-sm text-gray-600">Different Tracks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-2xl font-bold text-red-600">
              {conflictSessions.length}
            </div>
            <div className="text-sm text-gray-600">Conflicts</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
