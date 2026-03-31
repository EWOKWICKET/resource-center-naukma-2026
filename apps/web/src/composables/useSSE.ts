import { useBooksStore } from '@/stores/books.store';
import type { Book } from '@/types';

export function useSSE(): () => void {
  const booksStore = useBooksStore();

  const url = `${import.meta.env.VITE_API_BASE_URL ?? ''}/api/sse`;
  const es = new EventSource(url, { withCredentials: true });

  es.addEventListener('book:created', (event: MessageEvent) => {
    const { book } = JSON.parse(event.data) as { book: Book };
    booksStore.onBookCreated(book);
  });

  es.addEventListener('book:updated', (event: MessageEvent) => {
    const { book } = JSON.parse(event.data) as { book: Book };
    booksStore.onBookUpdated(book);
  });

  es.addEventListener('book:deleted', (event: MessageEvent) => {
    const { bookId } = JSON.parse(event.data) as { bookId: string };
    booksStore.onBookDeleted(bookId);
  });

  es.addEventListener('book:statusChanged', (event: MessageEvent) => {
    const { book } = JSON.parse(event.data) as { book: Book };
    booksStore.onBookStatusChanged(book);
  });

  return () => {
    es.close();
  };
}
