import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NewsService } from './news.service';
import { AdminNewsController, PublicNewsController } from './news.controller';

@Module({
    imports: [PrismaModule],
    controllers: [PublicNewsController, AdminNewsController],
    providers: [NewsService],
})
export class NewsModule {}
