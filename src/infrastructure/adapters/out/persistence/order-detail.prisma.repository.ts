import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { OrderDetailRepositoryPort } from '../../../../domain/ports/out/order-detail.repository.port';
import { OrderDetail } from '../../../../domain/entities/order-detail.entity';

@Injectable()
export class OrderDetailPrismaRepository implements OrderDetailRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByOrderId(orderId: number): Promise<OrderDetail[]> {
    const results = await this.prisma.orderDetail.findMany({
      where: { orderId },
      include: {
        product: true,
      },
    });
    return results as unknown as OrderDetail[];
  }

  async saveBatch(items: Partial<OrderDetail>[]): Promise<OrderDetail[]> {
    await this.prisma.orderDetail.createMany({
      data: items as any[],
    });

    // createMany doesn't return IDs, so fetch by orderId instead
    const orderId = items[0]?.orderId;
    if (!orderId) return [];

    const createdItems = await this.prisma.orderDetail.findMany({
      where: { orderId },
      include: { product: true },
    });

    return createdItems as unknown as OrderDetail[];
  }
}
