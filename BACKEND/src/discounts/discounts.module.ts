import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DiscountsService } from './discounts.service';
import { AdminDiscountsController, StoreDiscountsController } from './discounts.controller';

@Module({
    imports: [PrismaModule],
    providers: [DiscountsService],
    controllers: [AdminDiscountsController, StoreDiscountsController],
    exports: [DiscountsService],
})
export class DiscountsModule { }
