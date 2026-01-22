import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RefundsService } from './refunds.service';
import { AdminRefundsController, CustomerRefundsController } from './refunds.controller';

@Module({
    imports: [PrismaModule],
    providers: [RefundsService],
    controllers: [AdminRefundsController, CustomerRefundsController],
    exports: [RefundsService],
})
export class RefundsModule { }
