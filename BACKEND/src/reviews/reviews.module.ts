import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ReviewsService } from './reviews.service';
import {
    AdminReviewsController,
    StoreReviewsController,
    CustomerReviewsController,
} from './reviews.controller';

@Module({
    imports: [PrismaModule],
    providers: [ReviewsService],
    controllers: [
        AdminReviewsController,
        StoreReviewsController,
        CustomerReviewsController,
    ],
    exports: [ReviewsService],
})
export class ReviewsModule { }
