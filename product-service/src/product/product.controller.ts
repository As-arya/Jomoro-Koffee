import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, ReduceStockDto } from './dto/createProduct.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Products')
@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('products')
  @ApiOperation({ summary: 'Get all products' })
  @ApiOkResponse({ description: 'List of all products returned successfully' })
  getAllProducts() {
    return this.productService.findAllProducts();
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiOkResponse({ description: 'Product details returned successfully' })
  @ApiBadRequestResponse({ description: 'Product not found' })
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findProductById(id);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiOkResponse({ description: 'List of all categories returned successfully' })
  getAllCategories() {
    return this.productService.findAllCategories();
  }

  @Get('categories/:categoryId/products')
  @ApiOperation({ summary: 'Get products by category ID' })
  @ApiOkResponse({ description: 'List of products by category returned successfully' })
  @ApiBadRequestResponse({ description: 'Category not found' })
  getProductsByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.productService.findProductsByCategory(categoryId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, new RolesGuard('ADMIN'))
  @ApiOperation({ summary: 'Create a product' })
  @ApiOkResponse({ description: 'Product created successfully' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized. Admin only.' })
  @Post('admin/products')
  createProduct(@Body() data: CreateProductDto) {
    return this.productService.createProduct(data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, new RolesGuard('ADMIN'))
  @ApiOperation({ summary: 'Update a product' })
  @ApiOkResponse({ description: 'Product updated successfully' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized. Admin only.' })
  @Post('admin/products/:id/update')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateProductDto,
  ) {
    return this.productService.updateProduct(id, data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, new RolesGuard('ADMIN'))
  @ApiOperation({ summary: 'Reduce product stock' })
  @ApiOkResponse({ description: 'Stock reduced successfully' })
  @ApiBadRequestResponse({ description: 'Quantity exceeds available stock' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized. Admin only.' })
  @ApiBody({ type: ReduceStockDto })
  @Post('admin/products/:id/reduce')
  reduceStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ReduceStockDto,
  ) {
    return this.productService.reduceStock(id, data.quantity);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Reduce product stock for internal service calls' })
  @ApiOkResponse({ description: 'Stock reduced successfully' })
  @ApiBadRequestResponse({ description: 'Quantity exceeds available stock' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBody({ type: ReduceStockDto })
  @Post('internal/products/:id/reduce')
  reduceStockInternal(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ReduceStockDto,
  ) {
    return this.productService.reduceStock(id, data.quantity);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, new RolesGuard('ADMIN'))
  @ApiOperation({ summary: 'Delete a product' })
  @ApiOkResponse({ description: 'Product deleted successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized. Admin only.' })
  @Post('admin/products/:id/delete')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.deleteProduct(id);
  }
}