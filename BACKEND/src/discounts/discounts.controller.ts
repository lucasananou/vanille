import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DiscountsService } from './discounts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateDiscountDto, UpdateDiscountDto, ValidateDiscountDto } from './dto/discount.dto';

@ApiTags('Admin - Discounts')
@ApiBearerAuth()
@Controller('admin/discounts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminDiscountsController {
    constructor(private discountsService: DiscountsService) { }

    @Post()
    @ApiOperation({ summary: 'Create discount code' })
    async createDiscount(@Body() createDto: CreateDiscountDto) {
        return this.discountsService.createDiscount(createDto);
    }

    @Get()
    @ApiOperation({ summary: 'List all discount codes' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    async getDiscounts(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.discountsService.getDiscounts(
            page ? parseInt(page) : undefined,
            limit ? parseInt(limit) : undefined,
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get discount code' })
    async getDiscount(@Param('id') id: string) {
        return this.discountsService.getDiscount(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update discount code' })
    async updateDiscount(
        @Param('id') id: string,
        @Body() updateDto: UpdateDiscountDto,
    ) {
        return this.discountsService.updateDiscount(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete discount code' })
    async deleteDiscount(@Param('id') id: string) {
        return this.discountsService.deleteDiscount(id);
    }

    @Post('validate')
    @ApiOperation({ summary: 'Validate discount code (admin test)' })
    async validateDiscount(@Body() validateDto: ValidateDiscountDto) {
        return this.discountsService.validateDiscount(
            validateDto.code,
            validateDto.subtotal,
            validateDto.productIds,
            validateDto.collectionIds,
        );
    }
}

@ApiTags('Store - Discounts')
@Controller('store/discounts')
export class StoreDiscountsController {
    constructor(private discountsService: DiscountsService) { }

    @Post('validate')
    @ApiOperation({ summary: 'Validate discount code' })
    async validateDiscount(@Body() validateDto: ValidateDiscountDto) {
        return this.discountsService.validateDiscount(
            validateDto.code,
            validateDto.subtotal,
            validateDto.productIds,
            validateDto.collectionIds,
        );
    }
}
