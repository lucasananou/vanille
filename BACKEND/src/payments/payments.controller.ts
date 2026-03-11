import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateOrderDto } from '../orders/dto/create-order.dto';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('create-intent')
    async createPaymentIntent(@Body() body: { amount: number; currency?: string; subtotalAmount?: number; shippingRateId?: string; tax?: number }) {
        if (!body.amount) {
            throw new BadRequestException('Amount is required');
        }
        return this.paymentsService.createPaymentIntent(
            body.amount,
            body.currency,
            body.subtotalAmount,
            body.shippingRateId,
            body.tax || 0,
        );
    }

    @Post('paypal/create-order')
    async createPayPalOrder(@Body() body: { amount: number; currency?: string; subtotalAmount?: number; shippingRateId?: string; tax?: number }) {
        if (!body.amount || body.amount <= 0) {
            throw new BadRequestException('Valid amount is required');
        }

        const order = await this.paymentsService.createPayPalOrder(
            body.amount,
            body.currency || 'EUR',
            body.subtotalAmount,
            body.shippingRateId,
            body.tax || 0,
        );
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
