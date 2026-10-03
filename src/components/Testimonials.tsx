import { MessageSquareHeart, Star } from "lucide-react";
import FeedbackForm from "@/components/FeedbackForm";
import ReviewCarousel from "@/components/ReviewCarousel";
import { listFeedback } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

function Stars({ value, size = 18 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
          }
        />
      ))}
    </span>
  );
}

export default async function Testimonials() {
  let reviews: Awaited<ReturnType<typeof listFeedback>> = [];

  try {
    reviews = await listFeedback();
  } catch {
    reviews = [];
  }

  const count = reviews.length;
  const average = count ? reviews.reduce((sum, review) => sum + review.rating, 0) / count : 0;
  const distribution = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((review) => review.rating === star).length,
  );

  return (
    <section
      id="testimonials"
      className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300 scroll-mt-20"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <span className="text-primary font-bold text-xs tracking-widest uppercase mb-4 block">
            Client Reviews
          </span>
          <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-gray-900 dark:text-white">
            What Our Clients Say
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm max-w-xl mx-auto">
            Real experiences from organizations we serve. Ratings appear instantly —
            unfiltered, straight from our customers.
          </p>
        </div>

        {count > 0 ? (
          <>
            <div className="flex flex-col items-center gap-3 mb-12">
              <p className="font-heading font-extrabold text-5xl text-gray-900 dark:text-white">
                {average.toFixed(1)}
              </p>
              <Stars value={average} size={22} />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Based on {count} {count === 1 ? "review" : "reviews"}
              </p>
              <div className="mt-2 w-full max-w-xs space-y-1.5">
                {[5, 4, 3, 2, 1].map((star, idx) => (
                  <div key={star} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="w-3 font-bold">{star}</span>
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-full rounded-full bg-amber-400"
                        style={{ width: `${count ? (distribution[idx] / count) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="w-6 text-right">{distribution[idx]}</span>
                  </div>
                ))}
              </div>
            </div>

            <ReviewCarousel reviews={reviews} />

            <div className="mt-16">
              <div className="mb-8 text-center">
                <h3 className="font-heading font-bold text-2xl text-gray-900 dark:text-white">
                  Share Your Experience
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                  Worked with us? Your review goes live instantly.
                </p>
              </div>
              <FeedbackForm />
            </div>
          </>
        ) : (
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex flex-col items-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <MessageSquareHeart className="h-7 w-7" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-gray-900 dark:text-white">
                Be the First to Share Your Experience
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No reviews yet — yours will be the first, and it goes live instantly.
              </p>
            </div>
            <FeedbackForm />
          </div>
        )}
      </div>
    </section>
  );
}
