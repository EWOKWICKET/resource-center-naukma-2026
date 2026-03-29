import { CategoryModel } from '../models/category.model';
import { CategoryDoc, toCategory } from '../mappers/category.mapper';
import { Category } from '../types';

export const categoriesRepository = {
  async findAll(): Promise<Category[]> {
    const docs = await CategoryModel.find().lean<CategoryDoc[]>();

    return docs.map(toCategory);
  },

  async findById(id: string): Promise<Category | undefined> {
    const doc = await CategoryModel.findById(id).lean<CategoryDoc>();

    return doc ? toCategory(doc) : undefined;
  },

  async findByName(name: string): Promise<Category | undefined> {
    const doc = await CategoryModel.findOne({ name: new RegExp(`^${name}$`, 'i') }).lean<CategoryDoc>();

    return doc ? toCategory(doc) : undefined;
  },

  async create(data: Omit<Category, 'id'>): Promise<Category> {
    const doc = await CategoryModel.create(data);

    return toCategory(doc.toObject() as CategoryDoc);
  },

  async update(id: string, data: Partial<Omit<Category, 'id'>>): Promise<Category | undefined> {
    const doc = await CategoryModel.findByIdAndUpdate(id, data, { new: true }).lean<CategoryDoc>();

    return doc ? toCategory(doc) : undefined;
  },

  async delete(id: string): Promise<boolean> {
    const result = await CategoryModel.findByIdAndDelete(id);

    return result !== null;
  },
};
