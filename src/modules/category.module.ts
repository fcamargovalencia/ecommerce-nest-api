import { Module } from '@nestjs/common';
import { CategoryController } from '../infrastructure/adapters/in/http/category.controller';
import { CategoryService } from '../application/services/category.service';
import { CATEGORY_REPOSITORY } from '../domain/ports/out/repository.tokens';
import { CategoryPrismaRepository } from '../infrastructure/adapters/out/persistence/category.prisma.repository';
import { PrismaService } from '../infrastructure/adapters/out/persistence/prisma/prisma.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoryPrismaRepository,
    },
    PrismaService,
  ],
})
export class CategoryModule {}
