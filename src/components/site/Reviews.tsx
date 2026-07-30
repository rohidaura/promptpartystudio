import { motion } from "motion/react";
import { Star } from "lucide-react";
import type { Review } from "@/lib/cms-types";
import { Carousel } from "./Carousel";

export function Reviews({ reviews }: { reviews: Review[] }) {
  return (
    <Carousel ariaLabel="Customer reviews">
      {reviews.map((review, i) => (
        <motion.blockquote
          key={review.id}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 210, damping: 26, delay: i * 0.04 }}
          className="glass glass-sheen flex w-[300px] shrink-0 snap-start flex-col rounded-[var(--glass-radius)] p-7 sm:w-[360px]"
        >
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className="size-3.5"
                style={{
                  color: idx < review.rating ? "var(--accent2)" : "var(--muted-foreground)",
                  fill: idx < review.rating ? "currentColor" : "none",
                }}
              />
            ))}
          </div>
          <p className="mt-5 flex-1 text-sm leading-relaxed text-foreground/90">{review.body}</p>
          <footer className="mt-6 flex items-center gap-3">
            {review.avatar_url ? (
              <img
                src={review.avatar_url}
                alt={review.author_name}
                loading="lazy"
                className="size-11 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span
                className="size-11 shrink-0 rounded-full"
                style={{ background: "var(--gradient-primary)" }}
              />
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{review.author_name}</p>
              <p className="truncate text-xs text-muted-foreground">{review.author_role}</p>
            </div>
          </footer>
        </motion.blockquote>
      ))}
    </Carousel>
  );
}