import { Controller, Get, Post, Body, Param, ParseIntPipe, BadRequestException, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Products')
@Controller()
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get('products')
    getAllProducts() {
        return this.productService.findAllProducts();
    }

    @Get('products/:id')
    getProductById(@Param('id', ParseIntPipe) id: number) {
        return this.productService.findProductById(id);
    }

    @Get('categories')
    getAllCategories() {
        return this.productService.findAllCategories();
    }

    @Get('categories/:categoryId/products')
    getProductsByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
        return this.productService.findProductsByCategory(categoryId);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('admin/products')
    createProduct(@Request() req, @Body() data: CreateProductDto) {
        if (req.user.role !== 'ADMIN') throw new UnauthorizedException('Access denied. Admin only.');
        if (data.name.trim().split(/\s+/).length < 3) {
            throw new BadRequestException('Product name must contain at least 3 words.');
        }
        return this.productService.createProduct(data);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('admin/products/:id/update')
    updateProduct(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() data: CreateProductDto) {
        if (req.user.role !== 'ADMIN') throw new UnauthorizedException('Access denied. Admin only.');
        if (data.name.trim().split(/\s+/).length < 3) {
            throw new BadRequestException('Product name must contain at least 3 words.');
        }
        return this.productService.updateProduct(id, data);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiBody({ schema: { type: 'object', properties: { quantity: { type: 'number', example: 3 } } } })
    @Post('admin/products/:id/reduce')
    reduceStock(
    @Param('id', ParseIntPipe) id: number,
    @Body('quantity', ParseIntPipe) quantity: number
    ) {
    return this.productService.reduceStock(id, quantity);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('admin/products/:id/delete')
    deleteProduct(@Request() req, @Param('id', ParseIntPipe) id: number) {
        if (req.user.role !== 'ADMIN') throw new UnauthorizedException('Access denied. Admin only.');
        return this.productService.deleteProduct(id);
    }
}