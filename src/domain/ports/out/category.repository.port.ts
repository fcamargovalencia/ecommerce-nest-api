import { Category } from '../../entities/category.entity';

export interface CategoryRepositoryPort {
  findAll(): Promise<Category[]>;
  findById(id: number): Promise<Category | null>;
  save(data: Partial<Category>): Promise<Category>;
  update(id: number, data: Partial<Category>): Promise<Category>;
  deactivate(id: number): Promise<void>;
}

export const CATEGORY_REPOSITORY = 'CATEGORY_REPOSITORY';
