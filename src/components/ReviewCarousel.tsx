"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import type { Feedback } from "@/lib/dashboard";

export default function ReviewCarousel({ reviews }: { reviews: Feedback[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  if (!reviews.length) {
    return null;
  }

  const safeIndex = currentIndex % reviews.length;
  const review = reviews[safeIndex];

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };
  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const swipeThreshold = 60;
    if (info.offset.x < -swipeThreshold) {
      nextSlide();
    } else if (info.offset.x > swipeThreshold) {
      prevSlide();
    }
  };

  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="relative min-h-[300px] overflow-hidden md:min-h-[260px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.figure
            key={review.id}
            custom={direction}
            initial={{ opacity: 0, x: direction >= 0 ? 24 : -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction >= 0 ? -24 : 24 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 w-full cursor-grab touch-pan-y active:cursor-grabbing"
          >
            <div className="flex h-full flex-col bg-white p-8 shadow-xl dark:bg-gray-900 dark:shadow-gray-950 md:p-12">
              <Quote size={32} className="mb-4 text-primary/30" />
              <div className="mb-3 inline-flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={
                      star <= review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                    }
                  />
                ))}
              </div>
              <blockquote className="flex-grow text-base leading-relaxed text-gray-700 dark:text-gray-300 md:text-lg">
                {review.message}
              </blockquote>
              <figcaption className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-700">
                <p className="font-heading font-bold text-gray-900 dark:text-white">
                  {review.name}
                  {review.company && (
                    <span className="font-medium text-gray-500 dark:text-gray-400"> · {review.company}</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  {review.service} · {formatDateTime(review.created_at)}
                </p>
              </figcaption>
            </div>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between px-4">
        <button
          type="button"
          onClick={prevSlide}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-600 shadow-md transition-colors hover:bg-gray-50 hover:text-primary dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary"
          aria-label="Previous review"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex items-center gap-2">
          <span className="mr-2 text-xs font-bold text-gray-400 dark:text-gray-500">
            {safeIndex + 1} / {reviews.length}
          </span>
          {reviews.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goToSlide(idx)}
              className={`h-3 rounded-full transition-all duration-300 ${
                safeIndex === idx
                  ? "w-6 bg-primary"
                  : "w-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600"
              }`}
              aria-label={`Go to review ${idx + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-600 shadow-md transition-colors hover:bg-gray-50 hover:text-primary dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary"
          aria-label="Next review"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
