import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { VariantsService } from './variants.service';
import { AdminVariantsController } from './variants.controller';
import { AdminProductsImportController } from './admin-products-import.controller';

@Module({
    imports: [PrismaModule, MulterModule.register({ dest: './uploads' })],
    controllers: [ProductsController, AdminVariantsController, AdminProductsImportController],
    providers: [ProductsService, VariantsService],
    exports: [ProductsService, VariantsService],
})
export class ProductsModule { }
