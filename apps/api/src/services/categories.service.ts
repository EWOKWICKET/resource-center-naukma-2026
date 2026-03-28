import { Category } from '../types';
import { CategoryInput } from '../schemas/categories.schema';
import { categoriesRepository } from '../repositories/categories.repository';

export const categoriesService = {
  findAll(): Category[] {
    return categoriesRepository.findAll();
  },

  findById(id: string): Category {
    const category = categoriesRepository.findById(id);
    if (!category) throw { statusCode: 404, message: 'Category not found' };

    return category;
  },

  create(data: CategoryInput): Category {
    const existing = categoriesRepository.findByName(data.name);
    if (existing) throw { statusCode: 409, message: 'Category with this name already exists' };

    return categoriesRepository.create({ ...data, isActive: true });
  },

  update(id: string, data: CategoryInput): Category {
    this.findById(id);
    const duplicate = categoriesRepository.findByName(data.name);
    if (duplicate && duplicate.id !== id) {
      throw { statusCode: 409, message: 'Category with this name already exists' };
    }

    return categoriesRepository.update(id, data)!;
  },

  delete(id: string): void {
    this.findById(id);
    categoriesRepository.delete(id);
  },

  setStatus(id: string, isActive: boolean): Category {
    this.findById(id);

    return categoriesRepository.update(id, { isActive })!;
  },
};
