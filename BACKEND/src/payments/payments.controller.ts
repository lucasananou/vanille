import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('create-intent')
    async createPaymentIntent(@Body() body: { amount: number; currency?: string }) {
        if (!body.amount) {
            throw new BadRequestException('Amount is required');
        }
        // Amount should be passed in valid units (e.g. dollars/euros), service converts to cents
        return this.paymentsService.createPaymentIntent(body.amount, body.currency);
    }
}
