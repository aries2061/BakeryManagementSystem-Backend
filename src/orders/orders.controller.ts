import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrdersService, Order, OrderStatus } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/users.service';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() order: CreateOrderDto) {
    const orderData: Order = {
      ...order,
      status: order.status as unknown as OrderStatus,
    };
    return this.ordersService.create(orderData);
  }

  @Get()
  findAll(@Query('branch_id') branchId?: string) {
    return this.ordersService.findAll(branchId);
  }

  @Put(':id/status')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF)
  updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.ordersService.updateStatus(id, status);
  }
}
