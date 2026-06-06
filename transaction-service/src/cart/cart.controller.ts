import {
  Controller,
  Get,
  Post,
  Param,
  Body,
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
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
  @ApiOkResponse({ description: 'Cart retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  getCart(@Request() req, @Headers('authorization') token: string) {
    return this.cartService.getCart(req.user.id, token);
  }

  @Post()
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiBody({ type: AddCartDto })
  @ApiOkResponse({ description: 'Item added to cart successfully' })
  @ApiBadRequestResponse({ description: 'Product already in cart or quantity exceeds stock' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  addToCart(
    @Request() req,
    @Body() dto: AddCartDto,
    @Headers('authorization') token: string,
  ) {
    return this.cartService.addToCart(req.user.id, dto, token);
  }

  @Post('clear')
  @ApiOperation({ summary: 'Clear all items from cart' })
  @ApiOkResponse({ description: 'Cart cleared successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }

  @Post(':product_id/update')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiParam({ name: 'product_id', type: Number })
  @ApiBody({ type: UpdateCartDto })
  @ApiOkResponse({ description: 'Cart item updated successfully' })
  @ApiBadRequestResponse({ description: 'Item not found or quantity exceeds stock' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  updateCartItem(
    @Request() req,
    @Param('product_id', ParseIntPipe) productId: number,
    @Body() dto: UpdateCartDto,
    @Headers('authorization') token: string,
  ) {
    return this.cartService.updateCartItem(req.user.id, productId, dto, token);
  }

  @Post(':product_id/delete')
  @ApiOperation({ summary: 'Delete item from cart' })
  @ApiParam({ name: 'product_id', type: Number })
  @ApiOkResponse({ description: 'Item removed from cart successfully' })
  @ApiBadRequestResponse({ description: 'Item not found in cart' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  deleteCartItem(
    @Request() req,
    @Param('product_id', ParseIntPipe) productId: number,
  ) {
    return this.cartService.deleteCartItem(req.user.id, productId);
  }
}