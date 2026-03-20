import { Module } from '@nestjs/common';
import { ReviewController } from '../infrastructure/adapters/in/http/review.controller';
import { ReviewService } from '../application/services/review.service';
import { REVIEW_REPOSITORY, PRODUCT_REPOSITORY } from '../domain/ports/out/repository.tokens';
import { ReviewPrismaRepository } from '../infrastructure/adapters/out/persistence/review.prisma.repository';
import { ProductPrismaRepository } from '../infrastructure/adapters/out/persistence/product.prisma.repository';
import { PrismaService } from '../infrastructure/adapters/out/persistence/prisma/prisma.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ReviewController],
  providers: [
    ReviewService,
    {
      provide: REVIEW_REPOSITORY,
      useClass: ReviewPrismaRepository,
    },
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductPrismaRepository,
    },
    PrismaService,
  ],
})
export class ReviewModule {}
