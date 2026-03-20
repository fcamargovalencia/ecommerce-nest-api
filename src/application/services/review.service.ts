import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { CreateReviewDto } from '../dto/review';
import {
  ReviewRepositoryPort,
  REVIEW_REPOSITORY,
} from '../../domain/ports/out/review.repository.port';
import {
  ProductRepositoryPort,
  PRODUCT_REPOSITORY,
} from '../../domain/ports/out/product.repository.port';

@Injectable()
export class ReviewService {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: ReviewRepositoryPort,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async getByProduct(productId: number) {
    const product = await this.productRepository.findById(productId);
    if (!product || !product.active) {
      throw new NotFoundException('Product not found');
    }
    return this.reviewRepository.findByProductId(productId);
  }

  async getMyReviews(userId: number) {
    return this.reviewRepository.findByUserId(userId);
  }

  async create(userId: number, dto: CreateReviewDto) {
    const product = await this.productRepository.findById(dto.productId);
    if (!product || !product.active) {
      throw new NotFoundException('Product not found');
    }

    const existingReview = await this.reviewRepository.findByUserId(userId);
    const hasReviewedProduct = existingReview.some(
      (r) => r.productId === dto.productId,
    );
    if (hasReviewedProduct) {
      throw new ConflictException(
        'You have already reviewed this product',
      );
    }

    return this.reviewRepository.save({
      ...dto,
      userId,
    });
  }

  async delete(id: number, userId: number) {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    await this.reviewRepository.delete(id);
  }
}
