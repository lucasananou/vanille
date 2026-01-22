import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@Injectable()
export class AddressService {
    constructor(private prisma: PrismaService) { }

    async getAddresses(customerId: string) {
        return this.prisma.address.findMany({
            where: { customerId },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' },
            ],
        });
    }

    async getAddress(customerId: string, addressId: string) {
        const address = await this.prisma.address.findFirst({
            where: {
                id: addressId,
                customerId,
            },
        });

        if (!address) {
            throw new NotFoundException('Address not found');
        }

        return address;
    }

    async createAddress(customerId: string, createDto: CreateAddressDto) {
        // If this is set as default, unset other defaults
        if (createDto.isDefault) {
            await this.prisma.address.updateMany({
                where: { customerId, type: createDto.type },
                data: { isDefault: false },
            });
        }

        return this.prisma.address.create({
            data: {
                ...createDto,
                customerId,
            },
        });
    }

    async updateAddress(customerId: string, addressId: string, updateDto: UpdateAddressDto) {
        // Verify ownership
        await this.getAddress(customerId, addressId);

        // If setting as default, unset other defaults of same type
        if (updateDto.isDefault) {
            const address = await this.prisma.address.findUnique({
                where: { id: addressId },
            });

            if (address) {
                await this.prisma.address.updateMany({
                    where: {
                        customerId,
                        type: address.type,
                        id: { not: addressId },
                    },
                    data: { isDefault: false },
                });
            }
        }

        return this.prisma.address.update({
            where: { id: addressId },
            data: updateDto,
        });
    }

    async deleteAddress(customerId: string, addressId: string) {
        // Verify ownership
        await this.getAddress(customerId, addressId);

        await this.prisma.address.delete({
            where: { id: addressId },
        });

        return { message: 'Address deleted successfully' };
    }

    async setDefaultAddress(customerId: string, addressId: string) {
        const address = await this.getAddress(customerId, addressId);

        // Unset other defaults of same type
        await this.prisma.address.updateMany({
            where: {
                customerId,
                type: address.type,
                id: { not: addressId },
            },
            data: { isDefault: false },
        });

        return this.prisma.address.update({
            where: { id: addressId },
            data: { isDefault: true },
        });
    }
}
