import { defineStore } from 'pinia';
import { ref } from 'vue';
import { gqlClient } from '@/api/graphql/client';
import { GET_MY_LIBRARY, ADD_TO_LIBRARY, REMOVE_FROM_LIBRARY } from '@/api/graphql/user-book.gql';
import type { Book } from '@/types';

export const useLibraryStore = defineStore('library', () => {
  const books = ref<Book[]>([]);
  const savedIds = ref<string[]>([]);
  const loaded = ref(false);
  const loading = ref(false);

  function isSaved(bookId: string): boolean {
    return savedIds.value.includes(bookId);
  }

  async function fetchLibrary(): Promise<void> {
    if (loaded.value) return;
    loading.value = true;
    try {
      const data = await gqlClient.request<{ myLibrary: Book[] }>(GET_MY_LIBRARY);
      books.value = data.myLibrary;
      savedIds.value = data.myLibrary.map((b) => b.id);
      loaded.value = true;
    } catch {
      // silently ignore — user may not be authenticated yet
    } finally {
      loading.value = false;
    }
  }

  async function addBook(bookId: string): Promise<void> {
    await gqlClient.request(ADD_TO_LIBRARY, { bookId });
    if (!savedIds.value.includes(bookId)) {
      savedIds.value = [...savedIds.value, bookId];
    }
    loaded.value = false;
  }

  async function removeBook(bookId: string): Promise<void> {
    await gqlClient.request(REMOVE_FROM_LIBRARY, { bookId });
    savedIds.value = savedIds.value.filter((id) => id !== bookId);
    books.value = books.value.filter((b) => b.id !== bookId);
  }

  function reset(): void {
    books.value = [];
    savedIds.value = [];
    loaded.value = false;
  }

  return { books, loading, loaded, isSaved, fetchLibrary, addBook, removeBook, reset };
});
