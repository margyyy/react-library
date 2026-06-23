export type Book = {
  id: number;
  title: string;
  isbn?: string;
  isbn13?: string;
  authorId: number;
  averageRating?: number;
  languageCode?: string;
  numPages?: number;
  ratingsCount?: number;
  textReviewsCount?: number;
  publicationDate?: string;
  publisher?: string;
  createdAt: string;
  updatedAt: string;
  authorName?: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  data: T[];
  pagination: Pagination;
};

export type MessageResponse = {
  message: string;
};
