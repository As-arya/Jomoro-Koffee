import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [PrismaModule, AuthModule, CartModule, OrdersModule, ProfilesModule],
})
export class AppModule {}