import { Product } from '../../entities/product.entity';

export interface ProductRepositoryPort {
  findAll(): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  findBySellerId(sellerId: number): Promise<Product[]>;
  findByCategoryId(categoryId: number): Promise<Product[]>;
  searchByName(name: string): Promise<Product[]>;
  findByPriceRange(min: number, max: number): Promise<Product[]>;
  save(data: Partial<Product>): Promise<Product>;
  update(id: number, data: Partial<Product>): Promise<Product>;
  deactivate(id: number): Promise<void>;
}

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';
