import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';

@Module({
    imports: [PrismaModule],
    providers: [RecommendationsService],
    controllers: [RecommendationsController],
    exports: [RecommendationsService],
})
export class RecommendationsModule { }
