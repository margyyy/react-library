export type CreateBookDto = {
  title: string;
  isbn: string;
  isbn13: string;
  authorId: number;
  averageRating: number;
  languageCode: string;
  numPages: number;
  ratingsCount: number;
  textReviewsCount: number;
  publicationDate: string;
  publisher: string;
};

export type UpdateBookDto = {
  title: string;
  isbn: string;
  isbn13: string;
  authorId: number;
  averageRating: number;
  languageCode: string;
  numPages: number;
  ratingsCount: number;
  textReviewsCount: number;
  publicationDate: string;
  publisher: string;
};

export type BooksPageDto = {
  page: number;
  limit: number;
  search?: string;
};
