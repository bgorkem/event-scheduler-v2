"use server";

import {
  addSessionToSchedule,
  removeSessionFromSchedule,
} from "@/lib/dal/sessions";
import { revalidatePath } from "next/cache";

export async function toggleScheduleSessionAction(
  prevState: { isScheduled: boolean },
  formData: FormData
): Promise<{ isScheduled: boolean }> {
  const sessionId = Number(formData.get("session_id"));
  if (!sessionId) return { isScheduled: false };

  try {
    if (prevState.isScheduled) {
      await removeSessionFromSchedule(sessionId);
      revalidatePath("/members/sessions");
      revalidatePath("/members/schedule");
      return { isScheduled: false };
    } else {
      await addSessionToSchedule(sessionId);
      revalidatePath("/members/sessions");
      revalidatePath("/members/schedule");
      return { isScheduled: true };
    }
  } catch (error) {
    console.error("Error toggling session schedule:", error);
    return prevState;
  }
}
