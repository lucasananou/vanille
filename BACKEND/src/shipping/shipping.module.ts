import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ShippingService } from './shipping.service';
import { AdminShippingController, StoreShippingController } from './shipping.controller';

@Module({
    imports: [PrismaModule],
    providers: [ShippingService],
    controllers: [AdminShippingController, StoreShippingController],
    exports: [ShippingService],
})
export class ShippingModule { }
