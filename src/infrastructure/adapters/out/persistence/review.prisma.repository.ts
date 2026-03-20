import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ReviewRepositoryPort } from '../../../../domain/ports/out/review.repository.port';
import { Review } from '../../../../domain/entities/review.entity';

@Injectable()
export class ReviewPrismaRepository implements ReviewRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByProductId(productId: number): Promise<Review[]> {
    const results = await this.prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          include: {
            personalInfo: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return results as unknown as Review[];
  }

  async findByUserId(userId: number): Promise<Review[]> {
    const results = await this.prisma.review.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return results as unknown as Review[];
  }

  async findById(id: number): Promise<Review | null> {
    const result = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            personalInfo: true,
          },
        },
        product: true,
      },
    });
    return result ? (result as unknown as Review) : null;
  }

  async save(review: Partial<Review>): Promise<Review> {
    const result = await this.prisma.review.create({
      data: review as any,
      include: {
        user: {
          include: {
            personalInfo: true,
          },
        },
        product: true,
      },
    });
    return result as unknown as Review;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.review.delete({
      where: { id },
    });
  }
}
