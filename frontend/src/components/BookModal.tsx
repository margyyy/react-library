import type { Book } from "../types/book/book";
import { FALLBACK_BOOK_COVER_URL, getBookCoverUrl } from "../utils/image";
import { StarRating } from "./StarRating";
import { useEffect } from "react";
import { Link } from "react-router-dom";
export type BookModalProps = {
  book: Book;
  onOpen: (val: string) => void;
  onClose: () => void;
};

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  if (!value) return null;

  return (
    <p className="mb-1 text-[#cdd6f4]">
      <span className="font-semibold text-[#cba6f7]">{label}: </span>
      {value}
    </p>
  );
}

export function BookModal({ book, onClose, onOpen }: BookModalProps) {
  useEffect(() => {
    onOpen(String(book.id));
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#11111b]/70 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#f5c2e7]/30 bg-[#1e1e2e]/75 p-6 text-[#cdd6f4] shadow-[inset_1px_1px_0_rgba(255,255,255,0.22),0_30px_100px_rgba(17,17,27,0.7)] backdrop-blur-2xl backdrop-saturate-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#cba6f7]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#89b4fa]/10 blur-3xl" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-1 pb-3">
          <div className="flex justify-center items-start">
            <img
              src={getBookCoverUrl(book.isbn, book.isbn13)}
              alt={book.title}
              onError={(event) => {
                if (event.currentTarget.src !== FALLBACK_BOOK_COVER_URL) {
                  event.currentTarget.src = FALLBACK_BOOK_COVER_URL;
                }
              }}
              className="w-full max-w-[300px] rounded-xl border border-white/15 object-cover shadow-[0_16px_45px_rgba(17,17,27,0.55)]"
            />
          </div>

          <div className="flex flex-col">
            <h2 className="mb-2 overflow-hidden text-ellipsis text-2xl font-bold leading-tight text-[#f5e0dc]">
              {book.title}
            </h2>

            <div className="space-y-1">
              <InfoRow label="Autore" value={book.authorName} />
              <InfoRow label="Editore" value={book.publisher} />
              <InfoRow
                label="Data di pubblicazione"
                value={book.publicationDate}
              />
              <InfoRow label="Pagine" value={book.numPages} />
              <InfoRow label="Lingua" value={book.languageCode} />
              <InfoRow label="ISBN" value={book.isbn} />
              <InfoRow label="ISBN13" value={book.isbn13} />
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-1 items-end gap-4 border-t border-white/10 pt-4 sm:grid-cols-2">
          <StarRating rating={book.averageRating ?? null} count={book.ratingsCount ?? null} />
          <div className="flex justify-end gap-2">
            <Link
              to={`/edit-book/${book.id}`}
              className="rounded-lg border border-[#cba6f7]/40 bg-[#cba6f7]/80 px-4 py-3 font-medium text-[#11111b] shadow-sm transition-colors hover:bg-[#cba6f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c2e7]"
            >
              Edit
            </Link>
            <button
              onClick={onClose}
              className="rounded-lg border border-white/15 bg-[#45475a]/70 px-4 py-3 font-medium text-white shadow-sm transition-colors hover:bg-[#585b70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cba6f7]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
