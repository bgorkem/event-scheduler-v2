"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Loader } from "lucide-react";
import { useActionState } from "react";
import { toggleScheduleSessionAction } from "@/app/actions/schedule";

interface SessionCardProps {
  session: any;
  isScheduled: boolean;
}

export default function SessionCard({ session, isScheduled }: SessionCardProps) {
  const [state, formAction, isPending] = useActionState(
    toggleScheduleSessionAction,
    { isScheduled }
  );

  // Use current state, but don't create infinite loops
  const currentlyScheduled = state?.isScheduled ?? isScheduled;
  const actionButtonText = currentlyScheduled ? "Remove from Schedule" : "Add to Schedule";
  const actionButtonVariant = currentlyScheduled ? "destructive" : "default";

  return (
    <Card className="hover:shadow-md transition-shadow">
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
              sp.participants ? `${sp.participants.first_name} ${sp.participants.last_name}` : ""
            ).join(", ")}
          </div>
        </div>
        <form action={formAction}>
          <input type="hidden" name="session_id" value={session.session_id} />
          <Button
            className="w-full mt-2 flex items-center justify-center"
            variant={actionButtonVariant}
            type="submit"
            disabled={isPending}
          >
            {isPending ? <Loader className="animate-spin w-4 h-4 mr-2" /> : null}
            {actionButtonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
