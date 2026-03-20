import { ProductDetail } from '../../entities/product-detail.entity';

export interface ProductDetailRepositoryPort {
  findByProductId(productId: number): Promise<ProductDetail | null>;
  save(data: Partial<ProductDetail>): Promise<ProductDetail>;
  upsert(productId: number, data: Partial<ProductDetail>): Promise<ProductDetail>;
}

export const PRODUCT_DETAIL_REPOSITORY = 'PRODUCT_DETAIL_REPOSITORY';
