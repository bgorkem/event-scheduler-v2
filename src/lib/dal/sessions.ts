import { createClient } from "@/lib/supabase/server";

export async function getScheduledSessions() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No user session found");

  const { data, error } = await supabase
    .from("user_scheduled_sessions")
    .select("session_id, sessions(*), has_conflict")
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getAllSessions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sessions")
    .select(
      `
            session_id, title, description, session_date, start_time, end_time, session_type,
            track_id, session_tracks(track_name),
            session_participants(participant_id, participants(first_name, last_name))
        `
    )
    .order("session_date", { ascending: true })
    .order("start_time", { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getUserScheduledSessionIds() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("user_scheduled_sessions")
    .select("session_id")
    .eq("user_id", user.id);
  if (error) return [];
  return (data || []).map((row: { session_id: number }) => row.session_id);
}

export async function addSessionToSchedule(sessionId: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No user session found");

  // Use stored procedure to schedule session and update conflicts
  const { error } = await supabase.rpc("schedule_session_for_user", {
    p_user_id: user.id,
    p_session_id: sessionId,
  });

  if (error) {
    // Handle the case where session is already scheduled
    if (error.message.includes("duplicate key")) {
      return true; // Already scheduled, that's fine
    }
    console.error("Error adding session to schedule:", error);
    throw new Error(error.message);
  }
  return true;
}

export async function removeSessionFromSchedule(sessionId: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No user session found");

  // Use stored procedure to unschedule session and update conflicts
  const { error } = await supabase.rpc("unschedule_session_for_user", {
    p_user_id: user.id,
    p_session_id: sessionId,
  });

  if (error) {
    console.error("Error removing session from schedule:", error);
    throw new Error(error.message);
  }
  return true;
}
