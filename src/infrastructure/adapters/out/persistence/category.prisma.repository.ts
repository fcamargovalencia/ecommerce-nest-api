import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CategoryRepositoryPort } from '../../../../domain/ports/out/category.repository.port';
import { Category } from '../../../../domain/entities/category.entity';

@Injectable()
export class CategoryPrismaRepository implements CategoryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    const results = await this.prisma.category.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    });
    return results as unknown as Category[];
  }

  async findById(id: number): Promise<Category | null> {
    const result = await this.prisma.category.findUnique({
      where: { id },
    });
    return result ? (result as unknown as Category) : null;
  }

  async save(category: Partial<Category>): Promise<Category> {
    const result = await this.prisma.category.create({
      data: category as any,
    });
    return result as unknown as Category;
  }

  async update(id: number, data: Partial<Category>): Promise<Category> {
    const result = await this.prisma.category.update({
      where: { id },
      data: data as any,
    });
    return result as unknown as Category;
  }

  async deactivate(id: number): Promise<void> {
    await this.prisma.category.update({
      where: { id },
      data: { active: false },
    });
  }
}
