import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddCartDto } from './dto/add-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  private productServiceUrl = process.env.PRODUCT_SERVICE_URL;

  constructor(private prisma: PrismaService) {}

  private async getProduct(productId: number, token: string) {
    const res = await fetch(
      `${this.productServiceUrl}/products/${productId}`,
      { headers: { Authorization: token } },
    );
    if (!res.ok) throw new NotFoundException(`Product ${productId} not found`);
    return res.json();
  }

  async getCart(userId: number, token: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
      include: { cart_items: true },
    });
    if (!cart || cart.cart_items.length === 0)
      return { message: 'Cart is empty', items: [] };

    const items = await Promise.all(
      cart.cart_items.map(async (item) => {
        const product = await this.getProduct(item.product_id, token);
        return {
          cart_item_id: item.id,
          product_id: item.product_id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
        };
      }),
    );
    return { cart_id: cart.id, items };
  }

  async addToCart(userId: number, dto: AddCartDto, token: string) {
    const { product_id, quantity } = dto;
    const product = await this.getProduct(product_id, token);
    if (quantity > product.stock)
      throw new BadRequestException(
        `Quantity (${quantity}) exceeds stock (${product.stock})`,
      );

    let cart = await this.prisma.cart.findUnique({ where: { user_id: userId } });
    if (!cart) cart = await this.prisma.cart.create({ data: { user_id: userId } });

    const existing = await this.prisma.cartItem.findFirst({
      where: { cart_id: cart.id, product_id },
    });
    if (existing) throw new BadRequestException('Product already exists in cart');

    await this.prisma.cartItem.create({
      data: { cart_id: cart.id, product_id, quantity },
    });
    return { message: 'Item added to cart successfully' };
  }

  async updateCartItem(userId: number, productId: number, dto: UpdateCartDto, token: string) {
    const product = await this.getProduct(productId, token);
    if (dto.quantity > product.stock)
      throw new BadRequestException(
        `Quantity (${dto.quantity}) exceeds stock (${product.stock})`,
      );

    const cart = await this.prisma.cart.findUnique({ where: { user_id: userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    const item = await this.prisma.cartItem.findFirst({
      where: { cart_id: cart.id, product_id: productId },
    });
    if (!item) throw new NotFoundException('Item not found in cart');

    await this.prisma.cartItem.update({ where: { id: item.id }, data: { quantity: dto.quantity } });
    return { message: 'Cart item updated successfully' };
  }

  async deleteCartItem(userId: number, productId: number) {
    const cart = await this.prisma.cart.findUnique({ where: { user_id: userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    const item = await this.prisma.cartItem.findFirst({
      where: { cart_id: cart.id, product_id: productId },
    });
    if (!item) throw new NotFoundException('Item not found in cart');

    await this.prisma.cartItem.delete({ where: { id: item.id } });
    return { message: 'Item removed from cart successfully' };
  }

  async clearCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({ where: { user_id: userId } });
    if (!cart) throw new NotFoundException('Cart not found');
    await this.prisma.cartItem.deleteMany({ where: { cart_id: cart.id } });
    return { message: 'Cart cleared successfully' };
  }
}