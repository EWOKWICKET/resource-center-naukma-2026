import mongoose, { Schema } from 'mongoose';

interface Book {
  title: string;
  author: string;
  description?: string;
  isbn?: string;
  coverUrl?: string;
  categoryId?: string;
  publishedYear?: number;
  isActive: boolean;
}

const bookSchema = new Schema<Book>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    isbn: { type: String, sparse: true, unique: true, trim: true },
    coverUrl: { type: String, trim: true },
    categoryId: { type: String, ref: 'Category' },
    publishedYear: { type: Number, min: 1, max: 2200 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

bookSchema.index({ title: 'text', author: 'text' });

export const BookModel = mongoose.model<Book>('Book', bookSchema);
