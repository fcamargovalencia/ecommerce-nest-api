import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductController } from '../infrastructure/adapters/in/http/product.controller';
import { ProductService } from '../application/services/product.service';
import {
  PRODUCT_REPOSITORY,
  PRODUCT_DETAIL_REPOSITORY,
  CATEGORY_REPOSITORY,
} from '../domain/ports/out/repository.tokens';
import { ProductPrismaRepository } from '../infrastructure/adapters/out/persistence/product.prisma.repository';
import { ProductDetailPrismaRepository } from '../infrastructure/adapters/out/persistence/product-detail.prisma.repository';
import { CategoryPrismaRepository } from '../infrastructure/adapters/out/persistence/category.prisma.repository';
import { PrismaService } from '../infrastructure/adapters/out/persistence/prisma/prisma.service';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule, ConfigModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductPrismaRepository,
    },
    {
      provide: PRODUCT_DETAIL_REPOSITORY,
      useClass: ProductDetailPrismaRepository,
    },
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoryPrismaRepository,
    },
    PrismaService,
    RolesGuard,
  ],
})
export class ProductModule {}
