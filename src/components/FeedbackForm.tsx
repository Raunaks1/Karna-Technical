"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle, Send, Star } from "lucide-react";
import { submitFeedback } from "@/app/feedback/actions";
import { feedbackServices, type FeedbackFormState } from "@/lib/validation";

const inputClass =
  "mt-2 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-red-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-red-400 dark:focus:ring-red-950/30";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      {pending ? "Publishing..." : "Publish review"}
    </button>
  );
}

export default function FeedbackForm() {
  const [state, formAction] = useActionState(submitFeedback, {} as FeedbackFormState);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  if (state.success) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-8 text-center dark:border-emerald-900/50 dark:bg-emerald-950/30">
        <div className="mx-auto mb-3 flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={20} className="fill-amber-400 text-amber-400" />
          ))}
        </div>
        <p className="font-heading text-lg font-bold text-emerald-800 dark:text-emerald-200">
          {state.success}
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-900 sm:p-8"
    >
      {state.error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {state.error}
        </div>
      )}

      {/* Honeypot — invisible to humans, catches bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="mb-5">
        <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Your rating
        </span>
        <div className="mt-2 flex items-center gap-1" role="radiogroup" aria-label="Star rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                size={28}
                className={
                  star <= (hovered || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                }
              />
            </button>
          ))}
          <input type="hidden" name="rating" value={rating} />
        </div>
        {state.fieldErrors?.rating && (
          <p className="mt-1.5 text-xs font-medium text-primary">{state.fieldErrors.rating[0]}</p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Your name
          <input name="name" placeholder="e.g. Rahul Sharma" className={inputClass} required maxLength={120} />
          {state.fieldErrors?.name && (
            <p className="mt-1.5 text-xs font-medium text-primary">{state.fieldErrors.name[0]}</p>
          )}
        </label>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Company <span className="font-normal text-gray-400">(optional)</span>
          <input name="company" placeholder="e.g. ABC Industries" className={inputClass} maxLength={120} />
          {state.fieldErrors?.company && (
            <p className="mt-1.5 text-xs font-medium text-primary">{state.fieldErrors.company[0]}</p>
          )}
        </label>
      </div>

      <label className="mt-5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
        Service you used
        <select name="service" defaultValue="" className={inputClass} required>
          <option value="" disabled>
            Select a service
          </option>
          {feedbackServices.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
        {state.fieldErrors?.service && (
          <p className="mt-1.5 text-xs font-medium text-primary">{state.fieldErrors.service[0]}</p>
        )}
      </label>

      <label className="mt-5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
        Your experience
        <textarea
          name="message"
          rows={4}
          placeholder="Tell others about the quality of service, responsiveness, professionalism..."
          className={`${inputClass} resize-y`}
          required
          maxLength={1000}
        />
        {state.fieldErrors?.message && (
          <p className="mt-1.5 text-xs font-medium text-primary">{state.fieldErrors.message[0]}</p>
        )}
      </label>

      <div className="mt-6 flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
