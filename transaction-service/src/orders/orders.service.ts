import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
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

  async getOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { user_id: userId },
      include: { order_details: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async getOrderDetail(userId: number, orderId: number, token: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, user_id: userId },
      include: { order_details: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    const details = await Promise.all(
      order.order_details.map(async (detail) => {
        const product = await this.getProduct(detail.product_id, token);
        return {
          product_id: detail.product_id,
          name: product.name,
          quantity: detail.quantity,
          price: detail.price,
        };
      }),
    );
    return { order_id: order.id, created_at: order.created_at, details };
  }

  async checkout(userId: number, token: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
      include: { cart_items: true },
    });
    if (!cart || cart.cart_items.length === 0)
      throw new BadRequestException('Cart is empty');

    const itemsWithPrice = await Promise.all(
      cart.cart_items.map(async (item) => {
        const product = await this.getProduct(item.product_id, token);
        return { product_id: item.product_id, quantity: item.quantity, price: product.price };
      }),
    );

    const order = await this.prisma.order.create({ data: { user_id: userId } });

    await this.prisma.orderDetail.createMany({
      data: itemsWithPrice.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    for (const item of cart.cart_items) {
      await fetch(
        `${this.productServiceUrl}/admin/products/${item.product_id}/reduce`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: token },
          body: JSON.stringify({ quantity: item.quantity }),
        },
      );
    }

    await this.prisma.cartItem.deleteMany({ where: { cart_id: cart.id } });
    return { message: 'Order placed successfully', order_id: order.id };
  }
}