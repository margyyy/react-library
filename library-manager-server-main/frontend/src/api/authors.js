import { get, post, put, del } from './client';

export function getAuthors(params = {}) {
  return get('/authors', params);
}

export function getAuthor(id) {
  return get(`/authors/${id}`);
}

export function getAuthorBooks(id) {
  return get(`/authors/${id}/books`);
}

export function createAuthor(data) {
  return post('/authors', data);
}

export function updateAuthor(id, data) {
  return put(`/authors/${id}`, data);
}

export function deleteAuthor(id) {
  return del(`/authors/${id}`);
}
