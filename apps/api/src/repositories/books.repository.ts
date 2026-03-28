import { randomUUID } from 'crypto';
import { Book, BookFilters, BooksPage } from '../types';

// ---------------------------------------------------------------------------
// In-memory mock repository — replace with Mongoose calls when DB is wired up
// ---------------------------------------------------------------------------

const now = new Date().toISOString();

const store: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A portrait of the Jazz Age in all of its decadence and excess.',
    isbn: '978-0-7432-7356-5',
    categoryId: '1',
    publishedYear: 1925,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '2',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    description: 'A landmark volume in science writing by one of the great minds of our time.',
    isbn: '978-0-553-38016-3',
    categoryId: '2',
    publishedYear: 1988,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '3',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    description: 'How did Homo sapiens rise to become the dominant force on Earth?',
    isbn: '978-0-06-231609-7',
    categoryId: '3',
    publishedYear: 2011,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '4',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    description:
      "The private thoughts of the world's most powerful man advising himself on how to make good on the responsibilities and obligations of his positions.",
    isbn: '978-0-14-044140-6',
    categoryId: '4',
    publishedYear: 180,
    isActive: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '5',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South torn by injustice.',
    isbn: '978-0-06-112008-4',
    categoryId: '1',
    publishedYear: 1960,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
];

export const booksRepository = {
  /**
   * Paginated list. `isActive` filter is applied only when explicitly provided —
   * callers decide the default (service layer defaults to true for public access).
   */
  findAll(filters: BookFilters = {}): BooksPage {
    let items = store.map((b) => ({ ...b }));

    if (filters.isActive !== undefined) {
      items = items.filter((b) => b.isActive === filters.isActive);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }

    if (filters.categoryId) {
      items = items.filter((b) => b.categoryId === filters.categoryId);
    }

    const total = items.length;
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const start = (page - 1) * limit;

    return { items: items.slice(start, start + limit), total, page, limit };
  },

  findById(id: string): Book | undefined {
    const found = store.find((b) => b.id === id);

    return found ? { ...found } : undefined;
  },

  countByStatus(): { total: number; active: number; inactive: number } {
    const active = store.filter((b) => b.isActive).length;

    return { total: store.length, active, inactive: store.length - active };
  },

  countByCategoryId(categoryId: string): number {
    return store.filter((b) => b.categoryId === categoryId && b.isActive).length;
  },

  create(data: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Book {
    const ts = new Date().toISOString();
    const book: Book = { id: randomUUID(), ...data, createdAt: ts, updatedAt: ts };
    store.push(book);

    return { ...book };
  },

  update(id: string, data: Partial<Omit<Book, 'id' | 'createdAt'>>): Book | undefined {
    const index = store.findIndex((b) => b.id === id);
    if (index === -1) return undefined;
    store[index] = { ...store[index], ...data, updatedAt: new Date().toISOString() };

    return { ...store[index] };
  },

  delete(id: string): boolean {
    const index = store.findIndex((b) => b.id === id);
    if (index === -1) return false;
    store.splice(index, 1);

    return true;
  },
};
