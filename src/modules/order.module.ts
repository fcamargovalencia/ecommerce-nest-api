import { Module } from '@nestjs/common';
import { OrderController } from '../infrastructure/adapters/in/http/order.controller';
import { OrderService } from '../application/services/order.service';
import {
  ORDER_REPOSITORY,
  ORDER_DETAIL_REPOSITORY,
  ADDRESS_REPOSITORY,
  PRODUCT_REPOSITORY,
} from '../domain/ports/out/repository.tokens';
import { OrderPrismaRepository } from '../infrastructure/adapters/out/persistence/order.prisma.repository';
import { OrderDetailPrismaRepository } from '../infrastructure/adapters/out/persistence/order-detail.prisma.repository';
import { AddressPrismaRepository } from '../infrastructure/adapters/out/persistence/address.prisma.repository';
import { ProductPrismaRepository } from '../infrastructure/adapters/out/persistence/product.prisma.repository';
import { PrismaService } from '../infrastructure/adapters/out/persistence/prisma/prisma.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderPrismaRepository,
    },
    {
      provide: ORDER_DETAIL_REPOSITORY,
      useClass: OrderDetailPrismaRepository,
    },
    {
      provide: ADDRESS_REPOSITORY,
      useClass: AddressPrismaRepository,
    },
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductPrismaRepository,
    },
    PrismaService,
  ],
})
export class OrderModule {}
