import { Category } from '../types';
import { MongoDoc } from './mongo';

export type CategoryDoc = MongoDoc<Category>;

export const toCategory = (doc: CategoryDoc): Category => ({
  id: doc._id.toString(),
  name: doc.name,
  description: doc.description,
  isActive: doc.isActive,
});
