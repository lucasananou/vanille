import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { CustomerAuthService } from '../customer-auth.service';

@Injectable()
export class CustomerJwtStrategy extends PassportStrategy(Strategy, 'customer-jwt') {
    constructor(
        private configService: ConfigService,
        private customerAuthService: CustomerAuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        } as any);
    }

    async validate(payload: any) {
        // Only allow customer tokens
        if (payload.type !== 'customer') {
            return null;
        }
        return this.customerAuthService.validateCustomer(payload.sub);
    }
}
