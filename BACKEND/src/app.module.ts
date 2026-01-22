import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { StorefrontModule } from './storefront/storefront.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { MailModule } from './mail/mail.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { CustomerAuthModule } from './customer-auth/customer-auth.module';
import { DiscountsModule } from './discounts/discounts.module';
import { UploadModule } from './upload/upload.module';
import { ReviewsModule } from './reviews/reviews.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ShippingModule } from './shipping/shipping.module';
import { TaxModule } from './tax/tax.module';
import { RefundsModule } from './refunds/refunds.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { SegmentsModule } from './segments/segments.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/',
    }),
    PrismaModule,
    MailModule,
    AuthModule,
    ProductsModule,
    StorefrontModule,
    CartModule,
    OrdersModule,
    AnalyticsModule,
    CustomerAuthModule,
    DiscountsModule,
    UploadModule,
    ReviewsModule,
    WishlistModule,
    ShippingModule,
    TaxModule,
    RefundsModule,
    RecommendationsModule,
    SegmentsModule,
    DashboardModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
