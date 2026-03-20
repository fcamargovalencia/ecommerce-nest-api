import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateOrderDto, UpdateOrderStatusDto } from '../dto/order';
import {
  OrderRepositoryPort,
  ORDER_REPOSITORY,
} from '../../domain/ports/out/order.repository.port';
import {
  OrderDetailRepositoryPort,
  ORDER_DETAIL_REPOSITORY,
} from '../../domain/ports/out/order-detail.repository.port';
import {
  AddressRepositoryPort,
  ADDRESS_REPOSITORY,
} from '../../domain/ports/out/address.repository.port';
import {
  ProductRepositoryPort,
  PRODUCT_REPOSITORY,
} from '../../domain/ports/out/product.repository.port';
import { Role } from '../../domain/enums/role.enum';
import { OrderStatus } from '../../domain/enums/order-status.enum';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
    @Inject(ORDER_DETAIL_REPOSITORY)
    private readonly orderDetailRepository: OrderDetailRepositoryPort,
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepository: AddressRepositoryPort,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async getMyOrders(userId: number) {
    return this.orderRepository.findByUserId(userId);
  }

  async getById(id: number, userId: number) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    return order;
  }

  async create(userId: number, dto: CreateOrderDto) {
    const address = await this.addressRepository.findById(
      dto.shippingAddressId,
    );
    if (!address || address.userId !== userId) {
      throw new NotFoundException('Address not found');
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of dto.items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product || !product.active) {
        throw new NotFoundException('Product not found');
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException('Insufficient stock');
      }

      totalAmount += product.price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
      });
    }

    const order = await this.orderRepository.save({
      userId,
      shippingAddressId: dto.shippingAddressId,
      totalAmount,
      status: OrderStatus.PENDING,
    });

    const orderDetails = orderItems.map((item) => ({
      orderId: order.id,
      ...item,
    }));

    await this.orderDetailRepository.saveBatch(orderDetails);

    return order;
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto, userRole: Role) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (userRole !== Role.ADMIN && userRole !== Role.SELLER) {
      throw new ForbiddenException('Not authorized');
    }

    return this.orderRepository.updateStatus(id, dto.status);
  }

  async cancel(id: number, userId: number) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    return this.orderRepository.updateStatus(id, OrderStatus.CANCELLED);
  }
}
