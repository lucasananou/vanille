import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { CustomerGuard } from '../customer-auth/guards/customer.guard';
import { AddToWishlistDto } from './dto/wishlist.dto';

@ApiTags('Customer - Wishlist')
@ApiBearerAuth()
@Controller('customer/wishlist')
@UseGuards(CustomerGuard)
export class WishlistController {
    constructor(private wishlistService: WishlistService) { }

    @Get()
    @ApiOperation({ summary: 'Get wishlist' })
    async getWishlist(@Req() req: any) {
        return this.wishlistService.getWishlist(req.user.userId);
    }

    @Post()
    @ApiOperation({ summary: 'Add item to wishlist' })
    async addItem(@Body() addDto: AddToWishlistDto, @Req() req: any) {
        return this.wishlistService.addItem(
            req.user.userId,
            addDto.productId,
            addDto.variantId,
        );
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove item from wishlist' })
    async removeItem(@Param('id') id: string, @Req() req: any) {
        return this.wishlistService.removeItem(id, req.user.userId);
    }

    @Post(':id/move-to-cart')
    @ApiOperation({ summary: 'Move item to cart' })
    async moveToCart(@Param('id') id: string, @Req() req: any) {
        return this.wishlistService.moveToCart(id, req.user.userId);
    }

    @Post('clear')
    @ApiOperation({ summary: 'Clear wishlist' })
    async clearWishlist(@Req() req: any) {
        return this.wishlistService.clearWishlist(req.user.userId);
    }
}
