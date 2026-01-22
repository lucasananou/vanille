import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VariantsService } from './variants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
    CreateProductOptionDto,
    UpdateProductOptionDto,
    CreateVariantDto,
    UpdateVariantDto,
    GenerateVariantsDto,
} from './dto/variant.dto';

@ApiTags('Admin - Product Variants')
@ApiBearerAuth()
@Controller('admin/products/:productId')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminVariantsController {
    constructor(private variantsService: VariantsService) { }

    // OPTIONS
    @Get('options')
    @ApiOperation({ summary: 'Get product options' })
    async getOptions(@Param('productId') productId: string) {
        return this.variantsService.getProductOptions(productId);
    }

    @Post('options')
    @ApiOperation({ summary: 'Create product option' })
    async createOption(
        @Param('productId') productId: string,
        @Body() createDto: CreateProductOptionDto,
    ) {
        return this.variantsService.createProductOption(productId, createDto);
    }

    @Patch('options/:optionId')
    @ApiOperation({ summary: 'Update product option' })
    async updateOption(
        @Param('productId') productId: string,
        @Param('optionId') optionId: string,
        @Body() updateDto: UpdateProductOptionDto,
    ) {
        return this.variantsService.updateProductOption(productId, optionId, updateDto);
    }

    @Delete('options/:optionId')
    @ApiOperation({ summary: 'Delete product option' })
    async deleteOption(
        @Param('productId') productId: string,
        @Param('optionId') optionId: string,
    ) {
        return this.variantsService.deleteProductOption(productId, optionId);
    }

    // VARIANTS
    @Get('variants')
    @ApiOperation({ summary: 'Get product variants' })
    async getVariants(@Param('productId') productId: string) {
        return this.variantsService.getProductVariants(productId);
    }

    @Get('variants/:variantId')
    @ApiOperation({ summary: 'Get one variant' })
    async getVariant(
        @Param('productId') productId: string,
        @Param('variantId') variantId: string,
    ) {
        return this.variantsService.getVariant(productId, variantId);
    }

    @Post('variants')
    @ApiOperation({ summary: 'Create variant' })
    async createVariant(
        @Param('productId') productId: string,
        @Body() createDto: CreateVariantDto,
    ) {
        return this.variantsService.createVariant(productId, createDto);
    }

    @Post('variants/generate')
    @ApiOperation({ summary: 'Auto-generate variants from options' })
    async generateVariants(
        @Param('productId') productId: string,
        @Body() generateDto: GenerateVariantsDto,
    ) {
        return this.variantsService.generateVariants(productId, generateDto.clearExisting);
    }

    @Patch('variants/:variantId')
    @ApiOperation({ summary: 'Update variant' })
    async updateVariant(
        @Param('productId') productId: string,
        @Param('variantId') variantId: string,
        @Body() updateDto: UpdateVariantDto,
    ) {
        return this.variantsService.updateVariant(productId, variantId, updateDto);
    }

    @Delete('variants/:variantId')
    @ApiOperation({ summary: 'Delete variant' })
    async deleteVariant(
        @Param('productId') productId: string,
        @Param('variantId') variantId: string,
    ) {
        return this.variantsService.deleteVariant(productId, variantId);
    }
}
