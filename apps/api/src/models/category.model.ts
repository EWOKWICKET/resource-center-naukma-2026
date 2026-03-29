import mongoose, { Schema } from 'mongoose';

interface Category {
  name: string;
  description?: string;
  isActive: boolean;
}

const categorySchema = new Schema<Category>({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
});

export const CategoryModel = mongoose.model<Category>('Category', categorySchema);
