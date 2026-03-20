import { Order } from '../../entities/order.entity';
import { OrderStatus } from '../../enums/order-status.enum';

export interface OrderRepositoryPort {
  findByUserId(userId: number): Promise<Order[]>;
  findById(id: number): Promise<Order | null>;
  save(data: Partial<Order>): Promise<Order>;
  updateStatus(id: number, status: OrderStatus): Promise<Order>;
}

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';
