import http from './client';
import type { Book, BookInput, BookFilters } from '@/types';

export const booksApi = {
  async getAll(filters: BookFilters): Promise<Book[]> {
    const { data } = await http.get<Book[]>('/api/books', { params: filters });
    return data;
  },

  async getOne(id: string): Promise<Book> {
    const { data } = await http.get<Book>(`/api/books/${id}`);
    return data;
  },

  async create(dto: BookInput): Promise<Book> {
    const { data } = await http.post<Book>('/api/books', dto);
    return data;
  },

  async update(id: string, dto: BookInput): Promise<Book> {
    const { data } = await http.put<Book>(`/api/books/${id}`, dto);
    return data;
  },

  async remove(id: string): Promise<void> {
    await http.delete(`/api/books/${id}`);
  },

  async setStatus(id: string, isActive: boolean): Promise<Book> {
    const { data } = await http.patch<Book>(`/api/books/${id}/status`, { isActive });
    return data;
  },
};
