"use server";

import { revalidatePath } from "next/cache";
import { requireDashboardUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { feedbackIdSchema, getFormString } from "@/lib/validation";

// Safety net only: reviews publish instantly with no approval step.
// Owner and HR accounts can remove inappropriate entries here.
export async function deleteFeedback(formData: FormData) {
  await requireDashboardUser();
  const parsed = feedbackIdSchema.safeParse({ feedbackId: getFormString(formData, "feedbackId") });

  if (!parsed.success) {
    throw new Error("The review is invalid.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("feedback").delete().eq("id", parsed.data.feedbackId);

  if (error) {
    throw new Error("The review could not be removed.");
  }

  revalidatePath("/dashboard/feedback");
  revalidatePath("/");
}
