import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { CustomerGuard } from './guards/customer.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@ApiTags('Customer Addresses')
@ApiBearerAuth()
@Controller('customer/addresses')
@UseGuards(CustomerGuard)
export class AddressController {
    constructor(private addressService: AddressService) { }

    @Get()
    @ApiOperation({ summary: 'Get all addresses' })
    async getAddresses(@CurrentUser() customer: any) {
        return this.addressService.getAddresses(customer.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get one address' })
    async getAddress(
        @CurrentUser() customer: any,
        @Param('id') addressId: string,
    ) {
        return this.addressService.getAddress(customer.id, addressId);
    }

    @Post()
    @ApiOperation({ summary: 'Create address' })
    async createAddress(
        @CurrentUser() customer: any,
        @Body() createDto: CreateAddressDto,
    ) {
        return this.addressService.createAddress(customer.id, createDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update address' })
    async updateAddress(
        @CurrentUser() customer: any,
        @Param('id') addressId: string,
        @Body() updateDto: UpdateAddressDto,
    ) {
        return this.addressService.updateAddress(customer.id, addressId, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete address' })
    async deleteAddress(
        @CurrentUser() customer: any,
        @Param('id') addressId: string,
    ) {
        return this.addressService.deleteAddress(customer.id, addressId);
    }

    @Patch(':id/set-default')
    @ApiOperation({ summary: 'Set address as default' })
    async setDefaultAddress(
        @CurrentUser() customer: any,
        @Param('id') addressId: string,
    ) {
        return this.addressService.setDefaultAddress(customer.id, addressId);
    }
}
