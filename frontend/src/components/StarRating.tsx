import { Star, StarHalf } from "lucide-react";

type StarRatingProps = {
  rating: number | null;
  count: number | null;
};

export function StarRating({ rating, count }: StarRatingProps) {
  if (rating === null || count === null) {
    return null;
  } else {
    const displayRating = Math.round(rating * 2) / 2;

    return (
      <div className="flex flex-col gap-1 ">
        <div className="flex items-center gap-1 text-yellow-500">
          {[...Array(5)].map((_, i) => {
            const starValue = i + 1;
            if (displayRating >= starValue) {
              return <Star key={i} size={18} fill="currentColor" />;
            } else if (displayRating >= starValue - 0.5) {
              return <StarHalf key={i} size={18} fill="currentColor" />;
            } else {
              return <Star key={i} size={18} className="text-[#585b70]" />;
            }
          })}
          <span className="ml-2 text-sm font-bold text-[#f5e0dc]">
            {rating.toFixed(1)}
          </span>
        </div>
        <span className="text-xs text-[#bac2de]">
          ({count.toLocaleString()} ratings)
        </span>
      </div>
    );
  }
}
