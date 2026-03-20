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
    const results = await this.prisma.orderDetail.createMany({
      data: items as any[],
    });

    // Fetch the created items to return them with relations
    const createdOrderDetailIds = items.map((item) => item.id).filter(Boolean) as number[];
    const createdItems = await this.prisma.orderDetail.findMany({
      where: {
        id: {
          in: createdOrderDetailIds,
        },
      },
      include: {
        product: true,
      },
    });

    return createdItems as unknown as OrderDetail[];
  }
}
