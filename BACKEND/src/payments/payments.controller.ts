import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateOrderDto } from '../orders/dto/create-order.dto';

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

    @Post('paypal/create-order')
    async createPayPalOrder(@Body() body: { amount: number; currency?: string }) {
        if (!body.amount || body.amount <= 0) {
            throw new BadRequestException('Valid amount is required');
        }

        const order = await this.paymentsService.createPayPalOrder(body.amount, body.currency || 'EUR');
        return { id: order.id };
    }

    @Post('paypal/finalize-order')
    async finalizePayPalOrder(@Body() body: { paypalOrderId: string; order: CreateOrderDto }) {
        if (!body.paypalOrderId) {
            throw new BadRequestException('paypalOrderId is required');
        }
        if (!body.order) {
            throw new BadRequestException('order payload is required');
        }

        return this.paymentsService.finalizePayPalOrder(body.paypalOrderId, body.order);
    }
}
