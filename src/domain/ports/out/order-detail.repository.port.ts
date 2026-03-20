import { OrderDetail } from '../../entities/order-detail.entity';

export interface OrderDetailRepositoryPort {
  findByOrderId(orderId: number): Promise<OrderDetail[]>;
  saveBatch(details: Partial<OrderDetail>[]): Promise<OrderDetail[]>;
}

export const ORDER_DETAIL_REPOSITORY = 'ORDER_DETAIL_REPOSITORY';
