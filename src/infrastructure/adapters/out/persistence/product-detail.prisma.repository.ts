import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ProductDetailRepositoryPort } from '../../../../domain/ports/out/product-detail.repository.port';
import { ProductDetail } from '../../../../domain/entities/product-detail.entity';

@Injectable()
export class ProductDetailPrismaRepository implements ProductDetailRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByProductId(productId: number): Promise<ProductDetail | null> {
    const result = await this.prisma.productDetail.findUnique({
      where: { productId },
    });
    return result ? (result as unknown as ProductDetail) : null;
  }

  async save(productDetail: Partial<ProductDetail>): Promise<ProductDetail> {
    const result = await this.prisma.productDetail.create({
      data: productDetail as any,
    });
    return result as unknown as ProductDetail;
  }

  async upsert(productId: number, data: Partial<ProductDetail>): Promise<ProductDetail> {
    const result = await this.prisma.productDetail.upsert({
      where: { productId },
      create: { productId, ...data } as any,
      update: data as any,
    });
    return result as unknown as ProductDetail;
  }
}
