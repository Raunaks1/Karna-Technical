"use server";

import { createHash } from "crypto";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  feedbackSchema,
  getFormString,
  type FeedbackFormState,
} from "@/lib/validation";

const MAX_PER_HOUR = 5;

function ipHash(value: string | null) {
  if (!value) {
    return null;
  }

  return createHash("sha256").update(value).digest("hex");
}

export async function submitFeedback(
  _previousState: FeedbackFormState,
  formData: FormData,
): Promise<FeedbackFormState> {
  // Honeypot: bots fill this invisible field. Pretend success so they move on.
  if (getFormString(formData, "website")) {
    return { success: "Thanks! Your review is now live below." };
  }

  const parsed = feedbackSchema.safeParse({
    name: getFormString(formData, "name"),
    company: getFormString(formData, "company"),
    rating: getFormString(formData, "rating"),
    service: getFormString(formData, "service"),
    message: getFormString(formData, "message"),
  });

  if (!parsed.success) {
    return {
      error: "Review the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : headerList.get("x-real-ip");
  const hash = ipHash(ip);

  const supabase = await createClient();

  if (hash) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("feedback")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", hash)
      .gte("created_at", oneHourAgo);

    if ((count ?? 0) >= MAX_PER_HOUR) {
      return { error: "Too many reviews submitted. Please try again later." };
    }
  }

  const { error } = await supabase.from("feedback").insert({
    name: parsed.data.name,
    company: parsed.data.company || "",
    rating: parsed.data.rating,
    service: parsed.data.service,
    message: parsed.data.message,
    ip_hash: hash,
  });

  if (error) {
    return { error: "Your review could not be published. Please try again." };
  }

  revalidatePath("/");
  return { success: "Thanks! Your review is now live below." };
}
