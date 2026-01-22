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
import { ShippingService } from './shipping.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
    CreateShippingZoneDto,
    UpdateShippingZoneDto,
    CreateShippingRateDto,
    UpdateShippingRateDto,
    CalculateShippingDto,
} from './dto/shipping.dto';

@ApiTags('Admin - Shipping')
@ApiBearerAuth()
@Controller('admin/shipping')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminShippingController {
    constructor(private shippingService: ShippingService) { }

    // ZONES
    @Post('zones')
    @ApiOperation({ summary: 'Create shipping zone' })
    async createZone(@Body() createDto: CreateShippingZoneDto) {
        return this.shippingService.createZone(createDto);
    }

    @Get('zones')
    @ApiOperation({ summary: 'List all zones' })
    async getZones() {
        return this.shippingService.getZones();
    }

    @Get('zones/:id')
    @ApiOperation({ summary: 'Get zone' })
    async getZone(@Param('id') id: string) {
        return this.shippingService.getZone(id);
    }

    @Patch('zones/:id')
    @ApiOperation({ summary: 'Update zone' })
    async updateZone(
        @Param('id') id: string,
        @Body() updateDto: UpdateShippingZoneDto,
    ) {
        return this.shippingService.updateZone(id, updateDto);
    }

    @Delete('zones/:id')
    @ApiOperation({ summary: 'Delete zone' })
    async deleteZone(@Param('id') id: string) {
        return this.shippingService.deleteZone(id);
    }

    // RATES
    @Post('zones/:zoneId/rates')
    @ApiOperation({ summary: 'Create shipping rate for zone' })
    async createRate(
        @Param('zoneId') zoneId: string,
        @Body() createDto: CreateShippingRateDto,
    ) {
        return this.shippingService.createRate(zoneId, createDto);
    }

    @Patch('rates/:rateId')
    @ApiOperation({ summary: 'Update shipping rate' })
    async updateRate(
        @Param('rateId') rateId: string,
        @Body() updateDto: UpdateShippingRateDto,
    ) {
        return this.shippingService.updateRate(rateId, updateDto);
    }

    @Delete('rates/:rateId')
    @ApiOperation({ summary: 'Delete shipping rate' })
    async deleteRate(@Param('rateId') rateId: string) {
        return this.shippingService.deleteRate(rateId);
    }
}

@ApiTags('Store - Shipping')
@Controller('store/shipping')
export class StoreShippingController {
    constructor(private shippingService: ShippingService) { }

    @Post('calculate')
    @ApiOperation({ summary: 'Calculate available shipping rates' })
    async calculateShipping(@Body() calculateDto: CalculateShippingDto) {
        return this.shippingService.calculateAvailableRates(
            calculateDto.country,
            calculateDto.region,
            calculateDto.orderValue,
        );
    }

    @Get('estimate')
    @ApiOperation({ summary: 'Quick shipping estimate' })
    @ApiQuery({ name: 'country', required: true })
    @ApiQuery({ name: 'region', required: false })
    async estimateShipping(
        @Query('country') country: string,
        @Query('region') region?: string,
    ) {
        const estimate = await this.shippingService.estimateShipping(country, region);
        if (!estimate) {
            return { message: 'No shipping available for this location' };
        }
        return estimate;
    }
}
