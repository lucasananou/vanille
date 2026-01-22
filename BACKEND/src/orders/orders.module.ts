import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AdminOrdersController } from './admin-orders.controller';
import { WebhooksController } from './webhooks.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsModule } from '../products/products.module';
import { CartModule } from '../cart/cart.module';

@Module({
    imports: [PrismaModule, ProductsModule, CartModule],
    controllers: [OrdersController, AdminOrdersController, WebhooksController],
    providers: [OrdersService],
    exports: [OrdersService],
})
export class OrdersModule { }
