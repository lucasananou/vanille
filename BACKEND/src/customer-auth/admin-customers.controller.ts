import {
    Controller,
    Get,
    Param,
    Query,
    UseGuards,
    ParseIntPipe,
    DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Admin - Customers')
@Controller('admin/customers')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('ADMIN' as any, 'STAFF' as any)
// @ApiBearerAuth()
export class AdminCustomersController {
    constructor(private readonly prisma: PrismaService) { }

    @Get()
    @ApiOperation({ summary: 'Get all customers (admin)' })
    @ApiResponse({ status: 200, description: 'Customers list' })
    async findAll(
        @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
        @Query('take', new DefaultValuePipe(50), ParseIntPipe) take: number,
    ) {
        return this.prisma.customer.findMany({
            skip,
            take,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                _count: {
                    select: {
                        orders: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get customer by ID (admin)' })
    @ApiResponse({ status: 200, description: 'Customer details' })
    async findOne(@Param('id') id: string) {
        return this.prisma.customer.findUnique({
            where: { id },
            include: {
                orders: {
                    select: {
                        id: true,
                        orderNumber: true,
                        total: true,
                        status: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                addresses: true,
                _count: {
                    select: {
                        orders: true,
                        reviews: true,
                        wishlistItems: true,
                    },
                },
            },
        });
    }
}
