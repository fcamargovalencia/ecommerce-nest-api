import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { OrderRepositoryPort } from '../../../../domain/ports/out/order.repository.port';
import { Order } from '../../../../domain/entities/order.entity';

@Injectable()
export class OrderPrismaRepository implements OrderRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: number): Promise<Order[]> {
    const results = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return results as unknown as Order[];
  }

  async findById(id: number): Promise<Order | null> {
    const result = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    });
    return result ? (result as unknown as Order) : null;
  }

  async save(order: any): Promise<Order> {
    const { userId, shippingAddressId, totalAmount, status, items } = order;

    const result = await this.prisma.order.create({
      data: {
        userId,
        shippingAddressId,
        totalAmount,
        status,
        items: {
          createMany: {
            data: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    });

    return result as unknown as Order;
  }

  async updateStatus(id: number, status: string): Promise<Order> {
    const result = await this.prisma.order.update({
      where: { id },
      data: { status: status as any },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    });
    return result as unknown as Order;
  }
}
