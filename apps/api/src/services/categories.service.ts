import { Category } from '../types';
import { CategoryInput } from '../schemas/categories.schema';
import { categoriesRepository } from '../repositories/categories.repository';

export const categoriesService = {
  async findAll(): Promise<Category[]> {
    return categoriesRepository.findAll();
  },

  async findById(id: string): Promise<Category> {
    const category = await categoriesRepository.findById(id);
    if (!category) throw { statusCode: 404, message: 'Category not found' };

    return category;
  },

  async create(data: CategoryInput): Promise<Category> {
    const existing = await categoriesRepository.findByName(data.name);
    if (existing) throw { statusCode: 409, message: 'Category with this name already exists' };

    return categoriesRepository.create({ ...data, isActive: true });
  },

  async update(id: string, data: CategoryInput): Promise<Category> {
    await this.findById(id);
    const duplicate = await categoriesRepository.findByName(data.name);
    if (duplicate && duplicate.id !== id) {
      throw { statusCode: 409, message: 'Category with this name already exists' };
    }

    return (await categoriesRepository.update(id, data))!;
  },

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await categoriesRepository.delete(id);
  },

  async setStatus(id: string, isActive: boolean): Promise<Category> {
    await this.findById(id);

    return (await categoriesRepository.update(id, { isActive }))!;
  },
};
