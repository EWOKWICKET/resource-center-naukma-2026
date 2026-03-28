export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  isbn?: string;
  coverUrl?: string;
  categoryId?: string;
  publishedYear?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
