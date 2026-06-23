import type { ApiResponse, Book, MessageResponse } from "../types/book/book";
import type {
  BooksPageDto,
  CreateBookDto,
  UpdateBookDto,
} from "../types/book/bookDTO";
import { api } from "./axios";

export async function getPaginatedBooks({
  page,
  limit,
  search,
}: BooksPageDto): Promise<ApiResponse<Book>> {
  return (await api.get("/books", { params: { page, limit, search: search || undefined } }))
    .data;
}

export async function createBook(bookData: CreateBookDto): Promise<Book> {
  return (await api.post("/books", bookData)).data;
}

export async function getBook(id: number): Promise<Book> {
  return (await api.get(`/books/${id}`)).data;
}

export async function updateBook(
  id: number,
  bookData: UpdateBookDto,
): Promise<Book> {
  return await api.put(`/books/${id}`, bookData);
}

export async function deleteBook(id: number): Promise<MessageResponse> {
  return (await api.delete(`/books/${id}`)).data;
}
