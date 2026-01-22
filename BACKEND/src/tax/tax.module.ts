import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TaxService } from './tax.service';
import { AdminTaxController, StoreTaxController } from './tax.controller';

@Module({
    imports: [PrismaModule],
    providers: [TaxService],
    controllers: [AdminTaxController, StoreTaxController],
    exports: [TaxService],
})
export class TaxModule { }
