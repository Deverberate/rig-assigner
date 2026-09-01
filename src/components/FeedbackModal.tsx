import { useState, useEffect, useCallback } from "react";
import {
  Star,
  X,
  MessageSquareText,
  ThumbsUp,
  Filter,
  ArrowUpDown,
  Send,
} from "lucide-react";
import type { FeedbackReview } from "../types";
import { triggerLightHaptic, triggerSuccessHaptic } from "../utils/haptics";

const STORAGE_KEY = "rigassigner-feedback-v2";
const LIKES_KEY = "rigassigner-liked-reviews";
const OLD_STORAGE_KEY = "rigassigner-feedback";

const CATEGORIES = [
  "All",
  "General",
  "Missing Part",
  "Price Inaccuracy",
  "Feature Request",
] as const;

type SortMode = "popular" | "newest" | "highest";

function loadReviews(): FeedbackReview[] {
  // One-time migration: purge old seed data stored under legacy key
  try {
    const oldStored = localStorage.getItem(OLD_STORAGE_KEY);
    if (oldStored) {
      const oldReviews = JSON.parse(oldStored) as FeedbackReview[];
      // Old seeds had IDs like fb-1..fb-6 — remove them all
      const hasSeeds = oldReviews.some((r) => /^fb-[1-6]$/.test(r.id));
      if (hasSeeds) {
        localStorage.removeItem(OLD_STORAGE_KEY);
      }
    }
  } catch {
    // ignore
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as FeedbackReview[];
    }
  } catch {
    // corrupt data
  }
  return [];
}

function saveReviews(reviews: FeedbackReview[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch {
    // storage full
  }
}

function loadLikedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(LIKES_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {
    // ignore
  }
  return new Set();
}

function saveLikedIds(ids: Set<string>) {
  try {
    localStorage.setItem(LIKES_KEY, JSON.stringify([...ids]));
  } catch {
    // ignore
  }
}

function StarRating({
  value,
  onChange,
  interactive = false,
  size = "md",
}: {
  value: number;
  onChange?: (v: number) => void;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const [hovered, setHovered] = useState(0);
  const starSize =
    size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-6 h-6" : "w-4.5 h-4.5";

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`${interactive ? "cursor-pointer" : "cursor-default"} transition-transform ${interactive ? "hover:scale-110" : ""}`}
        >
          <Star
            className={`${starSize} transition-colors ${
              star <= (interactive ? hovered || value : value)
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-slate-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function RatingBar({ count, total, stars }: { count: number; total: number; stars: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-[11px] text-slate-500">
      <span className="w-3 text-right">{stars}</span>
      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
      <div className="flex-1 h-1.5 bg-shadow-grey rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400/70 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-right">{count}</span>
    </div>
  );
}

export default function FeedbackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [reviews, setReviews] = useState<FeedbackReview[]>(() => loadReviews());
  const [likedIds, setLikedIds] = useState<Set<string>>(() => loadLikedIds());
  const [sortMode, setSortMode] = useState<SortMode>("popular");
  const [filterCategory, setFilterCategory] = useState<string>("All");

  // Review form state
  const [formOpen, setFormOpen] = useState(false);
  const [formRating, setFormRating] = useState(0);
  const [formCategory, setFormCategory] = useState<FeedbackReview["category"]>("General");
  const [formText, setFormText] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  // Save reviews when they change
  useEffect(() => {
    saveReviews(reviews);
  }, [reviews]);

  const handleLike = useCallback(
    (id: string) => {
      triggerLightHaptic();
      const isCurrentlyLiked = likedIds.has(id);
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlyLiked) next.delete(id);
        else next.add(id);
        saveLikedIds(next);
        return next;
      });
      setReviews((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, likes: r.likes + (isCurrentlyLiked ? -1 : 1) }
            : r
        )
      );
    },
    [likedIds]
  );

  const handleSubmitReview = useCallback(() => {
    if (formRating === 0 || !formText.trim()) return;
    triggerSuccessHaptic();
    const newReview: FeedbackReview = {
      id: `fb-${Date.now()}`,
      author: formAuthor.trim() || "Anonymous Builder",
      rating: formRating,
      category: formCategory,
      text: formText.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
    };
    setReviews((prev) => [newReview, ...prev]);
    setSubmitted(true);
    setTimeout(() => {
      setFormOpen(false);
      setSubmitted(false);
      setFormRating(0);
      setFormText("");
      setFormAuthor("");
      setFormCategory("General");
    }, 1500);
  }, [formRating, formText, formAuthor, formCategory]);

  // Filtered & sorted reviews
  const filteredReviews = reviews
    .filter((r) => filterCategory === "All" || r.category === filterCategory)
    .sort((a, b) => {
      if (sortMode === "popular") return b.likes - a.likes;
      if (sortMode === "newest")
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      return b.rating - a.rating;
    });

  // Rating stats
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : "0.0";
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
  }));

  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const categoryColors: Record<string, string> = {
    General: "bg-slate-700/50 text-slate-400 border-slate-600",
    "Missing Part": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "Price Inaccuracy": "bg-red-500/10 text-red-400 border-red-500/20",
    "Feature Request": "bg-cinnabar-500/10 text-cinnabar-400 border-cinnabar-500/20",
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-50 h-12 px-4 rounded-full bg-shadow-grey border border-shadow-grey-light text-slate-400 hover:text-amber-400 hover:border-amber-500/50 hover:bg-slate-700 shadow-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium"
        aria-label="Open reviews and feedback"
      >
        <MessageSquareText className="w-4 h-4" />
        <span className="hidden sm:inline">Reviews</span>
        {/* Glow badge */}
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[9px] font-bold text-slate-950 flex items-center justify-center shadow-[0_0_8px_rgba(245,158,11,0.5)]">
          {totalReviews}
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-lg max-h-[85vh] bg-shadow-grey border border-shadow-grey-light rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquareText className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-semibold text-slate-200">
                  Community Reviews
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-shadow-grey transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Rating summary */}
              <div className="px-5 py-4 border-b border-slate-800/50">
                <div className="flex items-start gap-4">
                  <div className="text-center shrink-0">
                    <div className="text-3xl font-bold text-slate-100">{avgRating}</div>
                    <StarRating value={Math.round(parseFloat(avgRating))} size="sm" />
                    <div className="text-[11px] text-slate-500 mt-1">
                      {totalReviews} review{totalReviews !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    {ratingDistribution.map((d) => (
                      <RatingBar
                        key={d.stars}
                        count={d.count}
                        total={totalReviews}
                        stars={d.stars}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Sort & filter bar */}
              <div className="px-5 py-3 border-b border-slate-800/50 space-y-2">
                {/* Sort tabs */}
                <div className="flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3 text-slate-600 mr-1" />
                  {(
                    [
                      { key: "popular", label: "Most Liked" },
                      { key: "newest", label: "Newest" },
                      { key: "highest", label: "Highest" },
                    ] as const
                  ).map((s) => (
                    <button
                      key={s.key}
                      onClick={() => {
                        triggerLightHaptic();
                        setSortMode(s.key);
                      }}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                        sortMode === s.key
                          ? "bg-cinnabar-500/10 text-cinnabar-400 border border-cinnabar-500/30"
                          : "text-slate-500 hover:text-slate-300 border border-transparent"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                {/* Category filter chips */}
                <div className="flex items-center gap-1 flex-wrap">
                  <Filter className="w-3 h-3 text-slate-600 mr-1" />
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        triggerLightHaptic();
                        setFilterCategory(cat);
                      }}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all border ${
                        filterCategory === cat
                          ? "bg-slate-700 text-slate-200 border-slate-600"
                          : "text-slate-500 hover:text-slate-400 border-transparent"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review list */}
              <div className="divide-y divide-slate-800/50">
                {filteredReviews.length === 0 ? (
                  <div className="px-5 py-12 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-shadow-grey-light/30 border border-shadow-grey-light/50 flex items-center justify-center">
                      <MessageSquareText className="w-6 h-6 text-shadow-grey-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-400">
                      {reviews.length === 0
                        ? "No reviews yet. Be the first to share your build feedback!"
                        : "No reviews in this category yet."}
                    </p>
                    {reviews.length === 0 && (
                      <p className="text-xs text-slate-600 mt-1.5">
                        Click \"Leave a Review\" below to get started.
                      </p>
                    )}
                  </div>
                ) : (
                  filteredReviews.map((review) => {
                    const isLiked = likedIds.has(review.id);
                    return (
                      <div key={review.id} className="px-5 py-4 hover:bg-shadow-grey/20 transition-colors">
                        {/* Author + meta row */}
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            {/* Avatar */}
                            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                              {review.author[0]}
                            </div>
                            <span className="text-xs font-semibold text-slate-300">
                              {review.author}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                                categoryColors[review.category] || "bg-slate-700/50 text-slate-500 border-slate-600"
                              }`}
                            >
                              {review.category}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-600">
                            {timeAgo(review.timestamp)}
                          </span>
                        </div>
                        {/* Stars */}
                        <div className="mb-1.5">
                          <StarRating value={review.rating} size="sm" />
                        </div>
                        {/* Text */}
                        <p className="text-xs text-slate-400 leading-relaxed mb-2">
                          {review.text}
                        </p>
                        {/* Like button */}
                        <button
                          onClick={() => handleLike(review.id)}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-all border ${
                            isLiked
                              ? "bg-cinnabar-500/10 text-cinnabar-400 border-cinnabar-500/20"
                              : "text-slate-500 hover:text-slate-300 border-transparent hover:bg-shadow-grey"
                          }`}
                        >
                          <ThumbsUp
                            className={`w-3 h-3 ${isLiked ? "fill-cinnabar-400" : ""}`}
                          />
                          {review.likes}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Leave a review footer */}
            <div className="border-t border-slate-800 shrink-0">
              {!formOpen ? (
                <button
                  onClick={() => {
                    triggerLightHaptic();
                    setFormOpen(true);
                  }}
                  className="w-full px-5 py-3.5 flex items-center justify-center gap-2 text-sm font-medium text-cinnabar-400 hover:bg-shadow-grey/50 transition-colors"
                >
                  <Star className="w-4 h-4" />
                  Leave a Review
                </button>
              ) : (
                <div className="px-5 py-4 space-y-3">
                  {submitted ? (
                    <div className="py-6 text-center">
                      <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <Send className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-sm font-semibold text-emerald-400">Review Posted!</p>
                      <p className="text-xs text-slate-500 mt-1">Thanks for your feedback.</p>
                    </div>
                  ) : (
                    <>
                      {/* Star picker */}
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                          Rating
                        </span>
                        <StarRating
                          value={formRating}
                          onChange={setFormRating}
                          interactive
                          size="lg"
                        />
                      </div>
                      {/* Category chips */}
                      <div className="flex gap-1.5 flex-wrap">
                        {(
                          ["General", "Missing Part", "Price Inaccuracy", "Feature Request"] as const
                        ).map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              triggerLightHaptic();
                              setFormCategory(cat);
                            }}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all ${
                              formCategory === cat
                                ? "bg-slate-700 text-slate-200 border-slate-600"
                                : "text-slate-500 hover:text-slate-400 border-transparent"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                      {/* Author name */}
                      <input
                        value={formAuthor}
                        onChange={(e) => setFormAuthor(e.target.value)}
                        placeholder="Your name (optional)"
                        className="w-full bg-shadow-grey/50 border border-shadow-grey-light rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cinnabar-500/50 transition-colors"
                      />
                      {/* Text area */}
                      <textarea
                        value={formText}
                        onChange={(e) => setFormText(e.target.value)}
                        placeholder="Share your experience or suggestion..."
                        rows={3}
                        className="w-full bg-shadow-grey/50 border border-shadow-grey-light rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cinnabar-500/50 resize-none transition-colors"
                      />
                      {/* Submit + cancel */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setFormOpen(false);
                            setFormRating(0);
                            setFormText("");
                            setFormAuthor("");
                          }}
                          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 bg-shadow-grey border border-shadow-grey-light hover:bg-slate-700 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmitReview}
                          disabled={formRating === 0 || !formText.trim()}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                            formRating > 0 && formText.trim()
                              ? "bg-cinnabar-500 text-slate-950 hover:bg-cinnabar-400 shadow-[0_0_15px_rgba(239,62,54,0.2)]"
                              : "bg-shadow-grey text-slate-600 cursor-not-allowed border border-shadow-grey-light"
                          }`}
                        >
                          <Send className="w-3.5 h-3.5" />
                          Post Review
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
