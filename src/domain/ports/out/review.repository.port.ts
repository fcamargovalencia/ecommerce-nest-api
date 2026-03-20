import { Review } from '../../entities/review.entity';

export interface ReviewRepositoryPort {
  findByProductId(productId: number): Promise<Review[]>;
  findByUserId(userId: number): Promise<Review[]>;
  findById(id: number): Promise<Review | null>;
  save(data: Partial<Review>): Promise<Review>;
  delete(id: number): Promise<void>;
}

export const REVIEW_REPOSITORY = 'REVIEW_REPOSITORY';
