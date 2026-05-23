import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/createProduct.dto';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async findAllProducts() {
        return this.prisma.product.findMany();
    }

    async findProductById(id: number) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    async findAllCategories() {
        return this.prisma.category.findMany();
    }

    async findProductsByCategory(categoryId: number) {
        return this.prisma.product.findMany({ where: { category_id: categoryId } });
    }



    async createProduct(data: CreateProductDto) {
        await this.prisma.product.create({ data });
        return { message: 'Product created successfully' };
    }

    async updateProduct(id: number, data: CreateProductDto) {
        await this.prisma.product.update({ where: { id }, data });
        return { message: 'Product updated successfully' };
    }

    async reduceStock(id: number, quantity: number) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) throw new NotFoundException('Product not found');

        if (quantity > product.stock) {
            throw new BadRequestException('Quantity exceeds product stock');
        }

        await this.prisma.product.update({
            where: { id },
            data: { stock: product.stock - quantity },
        });
        return { message: 'Stock reduced successfully' };
    }

    async deleteProduct(id: number) {
        await this.prisma.product.delete({ where: { id } });
        return { message: 'Product deleted successfully' };
    }
}