import mongoose, { Schema } from 'mongoose';

interface BookModel {
  title: string;
  authors: string[];
  genres: string[];
  description?: string;
  isbn?: string;
  publishedYear?: number;
  publisher?: string;
  language?: string;
  pageCount?: number;
  isActive: boolean;
}

const bookSchema = new Schema<BookModel>(
  {
    title: { type: String, required: true, trim: true },
    authors: { type: [String], required: true },
    genres: { type: [String], default: [] },
    description: { type: String, trim: true },
    isbn: { type: String, sparse: true, unique: true, trim: true },
    publishedYear: { type: Number, min: 1, max: 2200 },
    publisher: { type: String, trim: true },
    language: { type: String },
    pageCount: { type: Number, min: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

bookSchema.index({ title: 'text', authors: 'text' }, { language_override: 'lang_unused' });

export const BookModel = mongoose.model<BookModel>('Book', bookSchema);
