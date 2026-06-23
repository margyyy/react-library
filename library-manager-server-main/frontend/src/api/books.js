import { get, post, put, del } from './client';

export function getBooks(params = {}) {
  return get('/books', params);
}

export function getBook(id) {
  return get(`/books/${id}`);
}

export function createBook(data) {
  return post('/books', data);
}

export function updateBook(id, data) {
  return put(`/books/${id}`, data);
}

export function deleteBook(id) {
  return del(`/books/${id}`);
}
