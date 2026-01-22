import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TaxService } from './tax.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateTaxRateDto, UpdateTaxRateDto, CalculateTaxDto } from './dto/tax.dto';

@ApiTags('Admin - Tax')
@ApiBearerAuth()
@Controller('admin/tax')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminTaxController {
    constructor(private taxService: TaxService) { }

    @Post('rates')
    @ApiOperation({ summary: 'Create tax rate' })
    async createRate(@Body() createDto: CreateTaxRateDto) {
        return this.taxService.createRate(createDto);
    }

    @Get('rates')
    @ApiOperation({ summary: 'List all tax rates' })
    async getRates() {
        return this.taxService.getRates();
    }

    @Get('rates/:id')
    @ApiOperation({ summary: 'Get tax rate' })
    async getRate(@Param('id') id: string) {
        return this.taxService.getRate(id);
    }

    @Patch('rates/:id')
    @ApiOperation({ summary: 'Update tax rate' })
    async updateRate(
        @Param('id') id: string,
        @Body() updateDto: UpdateTaxRateDto,
    ) {
        return this.taxService.updateRate(id, updateDto);
    }

    @Delete('rates/:id')
    @ApiOperation({ summary: 'Delete tax rate' })
    async deleteRate(@Param('id') id: string) {
        return this.taxService.deleteRate(id);
    }
}

@ApiTags('Store - Tax')
@Controller('store/tax')
export class StoreTaxController {
    constructor(private taxService: TaxService) { }

    @Post('calculate')
    @ApiOperation({ summary: 'Calculate tax' })
    async calculateTax(@Body() calculateDto: CalculateTaxDto) {
        return this.taxService.calculateTax(
            calculateDto.country,
            calculateDto.region,
            calculateDto.subtotal,
        );
    }

    @Get('rate')
    @ApiOperation({ summary: 'Get tax rate for location' })
    @ApiQuery({ name: 'country', required: true })
    @ApiQuery({ name: 'region', required: false })
    async getTaxRate(
        @Query('country') country: string,
        @Query('region') region?: string,
    ) {
        const taxRate = await this.taxService.getTaxForLocation(country, region);
        if (!taxRate) {
            return { message: 'No tax applicable for this location' };
        }
        return {
            rate: taxRate.rate,
            name: taxRate.name,
        };
    }
}
