import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
import { CustomerAuthService } from './customer-auth.service';
import { AddressService } from './address.service';
import { CustomerAuthController, CustomerProfileController } from './customer-auth.controller';
import { AddressController } from './address.controller';
import { AdminCustomersController } from './admin-customers.controller';
import { CustomerJwtStrategy } from './strategies/customer-jwt.strategy';

@Module({
    imports: [
        PrismaModule,
        MailModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get('JWT_EXPIRATION', '15m'),
                } as any,
            }),
        }),
    ],
    providers: [CustomerAuthService, AddressService, CustomerJwtStrategy],
    controllers: [CustomerAuthController, CustomerProfileController, AddressController, AdminCustomersController],
    exports: [CustomerAuthService],
})
export class CustomerAuthModule { }
