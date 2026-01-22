import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    ParseIntPipe,
    DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Admin - Products')
@Controller('admin/products')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @ApiBearerAuth()
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @Roles(Role.ADMIN, Role.STAFF)
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, description: 'Product created successfully' })
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Post('bulk-delete')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete multiple products' })
    @ApiResponse({ status: 200, description: 'Products deleted successfully' })
    removeMany(@Body() body: { ids: string[] }) {
        return this.productsService.removeMany(body.ids);
    }

    @Get()
    @Roles(Role.ADMIN, Role.STAFF)
    @ApiOperation({ summary: 'Get all products (admin)' })
    @ApiQuery({ name: 'skip', required: false, type: Number })
    @ApiQuery({ name: 'take', required: false, type: Number })
    @ApiQuery({ name: 'published', required: false, type: Boolean })
    @ApiQuery({ name: 'collectionId', required: false, type: String })
    findAll(
        @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
        @Query('take', new DefaultValuePipe(50), ParseIntPipe) take: number,
        @Query('published') published?: string,
        @Query('collectionId') collectionId?: string,
        @Query('search') search?: string,
    ) {
        return this.productsService.findAll({
            skip,
            take,
            published: published === 'true' ? true : published === 'false' ? false : undefined,
            collectionId,
            search,
        });
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.STAFF)
    @ApiOperation({ summary: 'Get product by ID' })
    @ApiResponse({ status: 200, description: 'Product found' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.STAFF)
    @ApiOperation({ summary: 'Update a product' })
    @ApiResponse({ status: 200, description: 'Product updated successfully' })
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a product' })
    @ApiResponse({ status: 200, description: 'Product deleted successfully' })
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
