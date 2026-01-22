import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SegmentsService } from './segments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Admin - Customer Segments')
@ApiBearerAuth()
@Controller('admin/segments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class SegmentsController {
    constructor(private segmentsService: SegmentsService) { }

    @Post('update-all')
    @ApiOperation({ summary: 'Update segments for all customers' })
    async updateAllSegments() {
        return this.segmentsService.updateAllSegments();
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get segment statistics' })
    async getStats() {
        return this.segmentsService.getSegmentStats();
    }

    @Get(':segmentType/customers')
    @ApiOperation({ summary: 'Get customers by segment' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    async getCustomersBySegment(
        @Param('segmentType') segmentType: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.segmentsService.getCustomersBySegment(
            segmentType,
            page ? parseInt(page) : undefined,
            limit ? parseInt(limit) : undefined,
        );
    }

    @Post('customers/:customerId/update')
    @ApiOperation({ summary: 'Update segments for specific customer' })
    async updateCustomerSegments(@Param('customerId') customerId: string) {
        return this.segmentsService.updateCustomerSegments(customerId);
    }

    @Get('customers/:customerId')
    @ApiOperation({ summary: 'Get customer segments' })
    async getCustomerSegments(@Param('customerId') customerId: string) {
        return this.segmentsService.getCustomerSegments(customerId);
    }
}
