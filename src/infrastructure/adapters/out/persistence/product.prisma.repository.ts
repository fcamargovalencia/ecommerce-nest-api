import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ProductRepositoryPort } from '../../../../domain/ports/out/product.repository.port';
import { Product } from '../../../../domain/entities/product.entity';

@Injectable()
export class ProductPrismaRepository implements ProductRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    const results = await this.prisma.product.findMany({
      where: { active: true },
      include: {
        category: true,
        seller: true,
        detail: true,
      },
    });
    return results as unknown as Product[];
  }

  async findById(id: number): Promise<Product | null> {
    const result = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        seller: true,
        detail: true,
      },
    });
    return result ? (result as unknown as Product) : null;
  }

  async findBySellerId(sellerId: number): Promise<Product[]> {
    const results = await this.prisma.product.findMany({
      where: {
        sellerId,
        active: true,
      },
      include: {
        category: true,
        seller: true,
        detail: true,
      },
    });
    return results as unknown as Product[];
  }

  async findByCategoryId(categoryId: number): Promise<Product[]> {
    const results = await this.prisma.product.findMany({
      where: {
        categoryId,
        active: true,
      },
      include: {
        category: true,
        seller: true,
        detail: true,
      },
    });
    return results as unknown as Product[];
  }

  async searchByName(name: string): Promise<Product[]> {
    const results = await this.prisma.product.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
        active: true,
      },
      include: {
        category: true,
        seller: true,
        detail: true,
      },
    });
    return results as unknown as Product[];
  }

  async findByPriceRange(min: number, max: number): Promise<Product[]> {
    const results = await this.prisma.product.findMany({
      where: {
        price: {
          gte: min,
          lte: max,
        },
        active: true,
      },
      include: {
        category: true,
        seller: true,
        detail: true,
      },
    });
    return results as unknown as Product[];
  }

  async save(product: Partial<Product>): Promise<Product> {
    const result = await this.prisma.product.create({
      data: product as any,
      include: {
        category: true,
        seller: true,
        detail: true,
      },
    });
    return result as unknown as Product;
  }

  async update(id: number, data: Partial<Product>): Promise<Product> {
    const result = await this.prisma.product.update({
      where: { id },
      data: data as any,
      include: {
        category: true,
        seller: true,
        detail: true,
      },
    });
    return result as unknown as Product;
  }

  async deactivate(id: number): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data: { active: false },
    });
  }
}
