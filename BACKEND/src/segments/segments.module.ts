import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SegmentsService } from './segments.service';
import { SegmentsController } from './segments.controller';

@Module({
    imports: [PrismaModule],
    providers: [SegmentsService],
    controllers: [SegmentsController],
    exports: [SegmentsService],
})
export class SegmentsModule { }
