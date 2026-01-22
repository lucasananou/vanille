import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new cart' })
    @ApiResponse({ status: 201, description: 'Cart created' })
    createCart(@Body() createCartDto: CreateCartDto) {
        return this.cartService.createCart(createCartDto.sessionId, createCartDto.userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get cart by ID' })
    @ApiResponse({ status: 200, description: 'Cart found' })
    @ApiResponse({ status: 404, description: 'Cart not found' })
    getCart(@Param('id') id: string) {
        return this.cartService.getCart(id);
    }

    @Post(':id/items')
    @ApiOperation({ summary: 'Add item to cart' })
    @ApiResponse({ status: 200, description: 'Item added to cart' })
    addItem(@Param('id') id: string, @Body() addItemDto: AddItemDto) {
        return this.cartService.addItem(id, addItemDto.productId, addItemDto.quantity);
    }

    @Patch(':id/items/:itemId')
    @ApiOperation({ summary: 'Update cart item quantity' })
    @ApiResponse({ status: 200, description: 'Item updated' })
    updateItem(
        @Param('id') id: string,
        @Param('itemId') itemId: string,
        @Body() updateItemDto: UpdateItemDto,
    ) {
        return this.cartService.updateItemQuantity(id, itemId, updateItemDto.quantity);
    }

    @Delete(':id/items/:itemId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Remove item from cart' })
    @ApiResponse({ status: 200, description: 'Item removed' })
    removeItem(@Param('id') id: string, @Param('itemId') itemId: string) {
        return this.cartService.removeItem(id, itemId);
    }

    @Delete(':id/items')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Clear all items from cart' })
    @ApiResponse({ status: 200, description: 'Cart cleared' })
    clearCart(@Param('id') id: string) {
        return this.cartService.clearCart(id);
    }
}
