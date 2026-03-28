import { randomUUID } from 'crypto';
import { Category } from '../types';

// ---------------------------------------------------------------------------
// In-memory mock repository — replace with Mongoose calls when DB is wired up
// ---------------------------------------------------------------------------

const store: Category[] = [
  { id: '1', name: 'Fiction', description: 'Novels and fictional literature', isActive: true },
  { id: '2', name: 'Science', description: 'Natural and applied sciences', isActive: true },
  { id: '3', name: 'History', description: 'Historical accounts and biographies', isActive: true },
  { id: '4', name: 'Philosophy', description: 'Philosophy and ethics', isActive: false },
];

export const categoriesRepository = {
  findAll(): Category[] {
    return store.map((c) => ({ ...c }));
  },

  findById(id: string): Category | undefined {
    const found = store.find((c) => c.id === id);

    return found ? { ...found } : undefined;
  },

  findByName(name: string): Category | undefined {
    const found = store.find((c) => c.name.toLowerCase() === name.toLowerCase());

    return found ? { ...found } : undefined;
  },

  create(data: Omit<Category, 'id'>): Category {
    const category: Category = { id: randomUUID(), ...data };
    store.push(category);

    return { ...category };
  },

  update(id: string, data: Partial<Omit<Category, 'id'>>): Category | undefined {
    const index = store.findIndex((c) => c.id === id);
    if (index === -1) return undefined;
    store[index] = { ...store[index], ...data };

    return { ...store[index] };
  },

  delete(id: string): boolean {
    const index = store.findIndex((c) => c.id === id);
    if (index === -1) return false;
    store.splice(index, 1);

    return true;
  },
};
