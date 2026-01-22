import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RefundsService } from './refunds.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CustomerGuard } from '../customer-auth/guards/customer.guard';
import { CreateRefundDto, ProcessRefundDto } from './dto/refund.dto';

@ApiTags('Admin - Refunds')
@ApiBearerAuth()
@Controller('admin/refunds')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminRefundsController {
    constructor(private refundsService: RefundsService) { }

    @Get()
    @ApiOperation({ summary: 'List all refunds' })
    @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'APPROVED', 'REJECTED', 'PROCESSED'] })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    async getRefunds(
        @Query('status') status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED',
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.refundsService.getRefunds(
            status,
            page ? parseInt(page) : undefined,
            limit ? parseInt(limit) : undefined,
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get refund details' })
    async getRefund(@Param('id') id: string) {
        return this.refundsService.getRefund(id);
    }

    @Post(':id/process')
    @ApiOperation({ summary: 'Process refund (approve/reject)' })
    async processRefund(
        @Param('id') id: string,
        @Body() processDto: ProcessRefundDto,
        @Req() req: any,
    ) {
        return this.refundsService.processRefund(id, req.user.userId, processDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete refund' })
    async deleteRefund(@Param('id') id: string) {
        return this.refundsService.deleteRefund(id);
    }
}

@ApiTags('Customer - Refunds')
@ApiBearerAuth()
@Controller('customer/refunds')
@UseGuards(CustomerGuard)
export class CustomerRefundsController {
    constructor(private refundsService: RefundsService) { }

    @Get()
    @ApiOperation({ summary: 'Get my refunds' })
    async getMyRefunds(@Req() req: any) {
        return this.refundsService.getCustomerRefunds(req.user.userId);
    }

    @Post('orders/:orderId')
    @ApiOperation({ summary: 'Request refund for order' })
    async requestRefund(
        @Param('orderId') orderId: string,
        @Body() createDto: CreateRefundDto,
        @Req() req: any,
    ) {
        return this.refundsService.requestRefund(orderId, req.user.userId, createDto);
    }
}
