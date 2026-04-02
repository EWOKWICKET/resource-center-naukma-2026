import { defineStore } from 'pinia';
import { ref } from 'vue';
import { booksApi } from '@/api/rest/books.api';
import type { Book, BookInput, BookFilters } from '@/types';

export const useBooksStore = defineStore('books', () => {
  const items = ref<Book[]>([]);
  const loading = ref(false);
  const selected = ref<Book | null>(null);
  const filters = ref<BookFilters>({});

  async function fetchBooks(newFilters?: BookFilters): Promise<void> {
    if (newFilters) {
      filters.value = { ...filters.value, ...newFilters };
    }
    loading.value = true;
    try {
      items.value = await booksApi.getAll(filters.value);
    } finally {
      loading.value = false;
    }
  }

  async function fetchBook(id: string): Promise<void> {
    loading.value = true;
    try {
      selected.value = await booksApi.getOne(id);
    } finally {
      loading.value = false;
    }
  }

  async function createBook(dto: BookInput): Promise<void> {
    await booksApi.create(dto);
  }

  async function updateBook(id: string, dto: BookInput): Promise<void> {
    await booksApi.update(id, dto);
  }

  async function deleteBook(id: string): Promise<void> {
    await booksApi.remove(id);
  }

  async function setBookStatus(id: string, isActive: boolean): Promise<void> {
    const book = await booksApi.setStatus(id, isActive);
    onBookUpdated(book);
  }

  function onBookCreated(book: Book): void {
    if (!items.value.some((b) => b.id === book.id)) {
      items.value.unshift(book);
    }
  }

  function onBookUpdated(book: Book): void {
    const index = items.value.findIndex((b) => b.id === book.id);
    if (index !== -1) {
      items.value[index] = book;
    }
  }

  function onBookDeleted(bookId: string): void {
    items.value = items.value.filter((b) => b.id !== bookId);
  }

  function onBookStatusChanged(book: Book): void {
    onBookUpdated(book);
  }

  return {
    items,
    loading,
    selected,
    filters,
    fetchBooks,
    fetchBook,
    createBook,
    updateBook,
    deleteBook,
    setBookStatus,
    onBookCreated,
    onBookUpdated,
    onBookDeleted,
    onBookStatusChanged,
  };
});
