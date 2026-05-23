import { Controller, Get, Post, Param,
  UseGuards, Request, Headers } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders for current user' })
  getOrders(@Request() req) {
    return this.ordersService.getOrders(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Checkout: create order from cart' })
  checkout(@Request() req, @Headers('authorization') token: string) {
    return this.ordersService.checkout(req.user.id, token);
  }

  @Post(':id')
  @ApiOperation({ summary: 'Get order detail by ID' })
  @ApiParam({ name: 'id', type: Number })
  getOrderDetail(@Request() req, @Param('id') id: string,
    @Headers('authorization') token: string) {
    return this.ordersService.getOrderDetail(req.user.id, +id, token);
  }
}