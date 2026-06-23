import { useState } from "react";
import { FALLBACK_BOOK_COVER_URL, getBookCoverUrl } from "../utils/image";

export type BookCardProps = {
  bookTitle: string;
  id?: number;
  isbn?: string;
  isbn13?: string;
  onClick: () => void;
};

export function BookCard({ bookTitle, isbn, isbn13, onClick }: BookCardProps) {
  const [imgSrc, setImgSrc] = useState(getBookCoverUrl(isbn, isbn13));
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <div
      className="group flex w-full cursor-pointer flex-col items-center gap-2"
      onClick={onClick}
    >
      <div
        className="relative aspect-[2/3] w-full max-w-[160px] cursor-pointer overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:w-[200px] sm:max-w-none sm:rounded-xl lg:w-[220px] xl:w-[210px] 2xl:w-[240px]"
      >
        {isImageLoading && (
          <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-br from-[#2a2040] via-[#3b2a58] to-[#1e1e2e]">
            <div className="absolute inset-x-4 top-5 h-3 rounded-full bg-purple-300/15" />
            <div className="absolute inset-x-6 bottom-10 h-3 rounded-full bg-purple-300/10" />
            <div className="absolute inset-x-10 bottom-5 h-3 rounded-full bg-purple-300/10" />
          </div>
        )}
        <img
          src={imgSrc}
          alt={bookTitle}
          onLoad={() => setIsImageLoading(false)}
          onError={() => {
            if (imgSrc !== FALLBACK_BOOK_COVER_URL) {
              setIsImageLoading(true);
              setImgSrc(FALLBACK_BOOK_COVER_URL);
            } else {
              setIsImageLoading(false);
            }
          }}
          className={`inset-0 h-full w-full object-cover transition-all duration-300 group-hover:blur-md group-hover:brightness-70 ${
            isImageLoading ? "opacity-0" : "opacity-100"
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="px-2 text-center text-sm font-bold text-white sm:text-lg xl:text-xl">
            {bookTitle}
          </span>
        </div>
      </div>
    </div>
  );
}
