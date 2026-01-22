import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CartModule } from '../cart/cart.module';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';

@Module({
    imports: [PrismaModule, CartModule],
    providers: [WishlistService],
    controllers: [WishlistController],
    exports: [WishlistService],
})
export class WishlistModule { }
