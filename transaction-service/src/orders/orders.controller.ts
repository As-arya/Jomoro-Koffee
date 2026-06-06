import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
  @ApiOkResponse({ description: 'List of orders returned successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  getOrders(@Request() req) {
    return this.ordersService.getOrders(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Checkout: create order from cart' })
  @ApiOkResponse({ description: 'Order placed successfully' })
  @ApiBadRequestResponse({ description: 'Cart is empty' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  checkout(@Request() req, @Headers('authorization') token: string) {
    return this.ordersService.checkout(req.user.id, token);
  }

  @Post(':id')
  @ApiOperation({ summary: 'Get order detail by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Order detail returned successfully' })
  @ApiBadRequestResponse({ description: 'Order not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  getOrderDetail(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Headers('authorization') token: string,
  ) {
    return this.ordersService.getOrderDetail(req.user.id, id, token);
  }
}