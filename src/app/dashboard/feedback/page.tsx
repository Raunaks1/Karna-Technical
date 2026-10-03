import { MessageSquareHeart, Star, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { deleteFeedback } from "@/app/dashboard/feedback/actions";
import { getDashboardUser } from "@/lib/auth";
import { listFeedback } from "@/lib/dashboard";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function FeedbackPage() {
  const user = await getDashboardUser();

  if (!user) {
    redirect("/login");
  }

  let reviews: Awaited<ReturnType<typeof listFeedback>> = [];
  let loadError: string | null = null;

  try {
    reviews = await listFeedback();
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Unable to load reviews.";
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
          Customer voice
        </p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
          Website reviews
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Reviews publish instantly with no approval step. Remove anything inappropriate
          here — deletion takes it off the website immediately.
        </p>
      </section>

      {loadError && (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {loadError}
          {loadError.toLowerCase().includes("feedback") && (
            <span className="mt-1 block text-xs font-normal opacity-90">
              The feedback table may not exist yet — run{" "}
              <code className="rounded bg-red-100 px-1.5 py-0.5 font-mono dark:bg-white/10">
                supabase/migrations/20261004000000_feedback.sql
              </code>{" "}
              in the Supabase SQL Editor.
            </span>
          )}
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#11151d] sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300">
            <MessageSquareHeart className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-extrabold">Live reviews</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"} visible on the website
            </p>
          </div>
        </div>

        {reviews.length ? (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border border-slate-100 p-4 dark:border-white/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3.5 w-3.5 ${
                              star <= review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-slate-200 text-slate-200 dark:fill-white/10 dark:text-white/10"
                            }`}
                          />
                        ))}
                      </span>
                      <p className="text-sm font-bold">
                        {review.name}
                        {review.company && (
                          <span className="font-medium text-slate-500 dark:text-slate-400">
                            {" "}· {review.company}
                          </span>
                        )}
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {review.service} · {formatDateTime(review.created_at)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {review.message}
                    </p>
                  </div>
                  <form action={deleteFeedback} className="shrink-0">
                    <input type="hidden" name="feedbackId" value={review.id} />
                    <button
                      type="submit"
                      aria-label={`Remove review by ${review.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loadError && (
            <div className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 dark:bg-white/5 dark:text-slate-400">
              No reviews yet. Published reviews will appear here.
            </div>
          )
        )}
      </section>
    </div>
  );
}
