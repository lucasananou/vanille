import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Query,
    UseGuards,
    ParseIntPipe,
    DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @ApiOperation({ summary: 'Create order from cart' })
    @ApiResponse({ status: 201, description: 'Order created' })
    createOrder(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.createOrderFromCart(createOrderDto);
    }

    @Post(':id/payment-intent')
    @ApiOperation({ summary: 'Create Stripe PaymentIntent for order' })
    @ApiResponse({ status: 200, description: 'PaymentIntent created' })
    createPaymentIntent(@Param('id') id: string) {
        return this.ordersService.createPaymentIntent(id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order by ID' })
    @ApiResponse({ status: 200, description: 'Order found' })
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN' as any, 'STAFF' as any)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all orders (admin)' })
    findAll(
        @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
        @Query('take', new DefaultValuePipe(50), ParseIntPipe) take: number,
    ) {
        return this.ordersService.findAll(skip, take);
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN' as any, 'STAFF' as any)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update order status (admin)' })
    updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateOrderStatusDto) {
        return this.ordersService.updateOrderStatus(id, updateStatusDto.status);
    }
}
