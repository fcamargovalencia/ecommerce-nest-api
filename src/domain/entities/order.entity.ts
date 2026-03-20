import { OrderStatus } from '../enums/order-status.enum';

export class Order {
  id: number;
  userId: number;
  shippingAddressId: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
