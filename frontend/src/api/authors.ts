import axios from "axios";
import type { Author } from "../types/author/author";

const API_URL = "http://localhost:3000/authors";

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function getAllAuthors(params?: { search?: string; limit?: number; page?: number }): Promise<PaginatedResponse<Author>> {
  const { data } = await axios.get(API_URL, { params });
  return data;
}

export async function createAuthor(authorData: { name: string }): Promise<Author> {
  const { data } = await axios.post(API_URL, authorData);
  return data;
}
