import {
    Controller,
    Get,
    Param,
    Patch,
    Body,
    Query,
    UseGuards,
    ParseIntPipe,
    DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Admin - Orders')
@Controller('admin/orders')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('ADMIN' as any, 'STAFF' as any)
// @ApiBearerAuth()
export class AdminOrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Get()
    @ApiOperation({ summary: 'Get all orders (admin)' })
    @ApiResponse({ status: 200, description: 'Orders list' })
    findAll(
        @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
        @Query('take', new DefaultValuePipe(50), ParseIntPipe) take: number,
        @Query('status') status?: string,
    ) {
        return this.ordersService.findAll(skip, take, status);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order by ID (admin)' })
    @ApiResponse({ status: 200, description: 'Order details' })
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update order status (admin)' })
    @ApiResponse({ status: 200, description: 'Order updated' })
    updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateOrderStatusDto) {
        return this.ordersService.updateOrderStatus(id, updateStatusDto.status);
    }
}
