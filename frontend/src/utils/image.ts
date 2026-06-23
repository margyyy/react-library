export const FALLBACK_BOOK_COVER_URL =
  "https://cdng.europosters.eu/pod_public/1300/138617.jpg";

export function getBookCoverUrl(isbn?: string, isbn13?: string) {
  const normalizedIsbn = isbn?.trim();
  const normalizedIsbn13 = isbn13?.trim();

  if (normalizedIsbn && normalizedIsbn !== "not found") {
    return `https://covers.openlibrary.org/b/isbn/${normalizedIsbn}-L.jpg?default=false`;
  }
  if (normalizedIsbn13 && normalizedIsbn13 !== "not found") {
    return `https://covers.openlibrary.org/b/isbn/${normalizedIsbn13}-L.jpg?default=false`;
  }
  return FALLBACK_BOOK_COVER_URL;
}
