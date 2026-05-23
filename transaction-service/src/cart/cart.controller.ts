import { Controller, Get, Post, Param, Body,
  UseGuards, Request, Headers } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation,
  ApiParam, ApiBody } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddCartDto } from './dto/add-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  getCart(@Request() req, @Headers('authorization') token: string) {
    return this.cartService.getCart(req.user.id, token);
  }

  @Post()
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiBody({ type: AddCartDto })
  addToCart(@Request() req, @Body() dto: AddCartDto,
    @Headers('authorization') token: string) {
    return this.cartService.addToCart(req.user.id, dto, token);
  }

  @Post('clear')
  @ApiOperation({ summary: 'Clear all items from cart' })
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }

  @Post(':product_id/update')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiParam({ name: 'product_id', type: Number })
  @ApiBody({ type: UpdateCartDto })
  updateCartItem(@Request() req, @Param('product_id') productId: string,
    @Body() dto: UpdateCartDto, @Headers('authorization') token: string) {
    return this.cartService.updateCartItem(req.user.id, +productId, dto, token);
  }

  @Post(':product_id/delete')
  @ApiOperation({ summary: 'Delete item from cart' })
  @ApiParam({ name: 'product_id', type: Number })
  deleteCartItem(@Request() req, @Param('product_id') productId: string) {
    return this.cartService.deleteCartItem(req.user.id, +productId);
  }
}