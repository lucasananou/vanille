import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Admin - Dashboard')
// @ApiBearerAuth()
@Controller('admin/dashboard')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('ADMIN')
export class DashboardController {
    constructor(private dashboardService: DashboardService) { }

    @Get('overview')
    @ApiOperation({ summary: 'Get dashboard overview' })
    async getOverview() {
        return this.dashboardService.getDashboardOverview();
    }

    @Get('revenue')
    @ApiOperation({ summary: 'Get total revenue' })
    async getRevenue() {
        return this.dashboardService.getTotalRevenue();
    }

    @Get('revenue/over-time')
    @ApiOperation({ summary: 'Get revenue over time' })
    @ApiQuery({ name: 'days', required: false })
    async getRevenueOverTime(@Query('days') days?: string) {
        return this.dashboardService.getRevenueOverTime(
            days ? parseInt(days) : undefined,
        );
    }

    @Get('orders')
    @ApiOperation({ summary: 'Get order statistics' })
    async getOrders() {
        return this.dashboardService.getTotalOrders();
    }

    @Get('orders/recent')
    @ApiOperation({ summary: 'Get recent orders' })
    @ApiQuery({ name: 'limit', required: false })
    async getRecentOrders(@Query('limit') limit?: string) {
        return this.dashboardService.getRecentOrders(
            limit ? parseInt(limit) : undefined,
        );
    }

    @Get('customers')
    @ApiOperation({ summary: 'Get customer statistics' })
    async getCustomers() {
        return this.dashboardService.getTotalCustomers();
    }

    @Get('products')
    @ApiOperation({ summary: 'Get product statistics' })
    async getProducts() {
        return this.dashboardService.getTotalProducts();
    }

    @Get('products/top-selling')
    @ApiOperation({ summary: 'Get top selling products' })
    @ApiQuery({ name: 'limit', required: false })
    async getTopProducts(@Query('limit') limit?: string) {
        return this.dashboardService.getTopSellingProducts(
            limit ? parseInt(limit) : undefined,
        );
    }

    @Get('sales/by-collection')
    @ApiOperation({ summary: 'Get sales by collection' })
    async getSalesByCollection() {
        return this.dashboardService.getSalesByCollection();
    }

    @Get('metrics/average-order-value')
    @ApiOperation({ summary: 'Get average order value' })
    async getAverageOrderValue() {
        return this.dashboardService.getAverageOrderValue();
    }

    @Get('metrics/conversion')
    @ApiOperation({ summary: 'Get conversion metrics' })
    async getConversionMetrics() {
        return this.dashboardService.getConversionMetrics();
    }
}
