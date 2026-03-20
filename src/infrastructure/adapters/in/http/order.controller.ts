import { Controller, Get, Post, Put, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrderService } from '../../../../application/services/order.service';
import { CreateOrderDto, UpdateOrderStatusDto } from '../../../../application/dto/order';
import { JwtAuthGuard } from '../../../security/jwt-auth.guard';
import { RolesGuard } from '../../../security/roles.guard';
import { Roles } from '../../../security/roles.guard';
import { GetUser } from '../../../../common/decorators/get-user.decorator';
import { Role } from '../../../../domain/enums/role.enum';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('my')
  @ApiOperation({ summary: 'Get my orders' })
  getMyOrders(@GetUser('userId') userId: number) {
    return this.orderService.getMyOrders(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  getById(@Param('id', ParseIntPipe) id: number, @GetUser('userId') userId: number) {
    return this.orderService.getById(id, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new order' })
  create(@GetUser('userId') userId: number, @Body() dto: CreateOrderDto) {
    return this.orderService.create(userId, dto);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SELLER)
  @ApiOperation({ summary: 'Update order status' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
    @GetUser('role') role: Role,
  ) {
    return this.orderService.updateStatus(id, dto, role);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel order' })
  cancel(@Param('id', ParseIntPipe) id: number, @GetUser('userId') userId: number) {
    return this.orderService.cancel(id, userId);
  }
}
