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
        await this.validateProductData(data);
        await this.prisma.product.create({ data });
        return { message: 'Product created successfully' };
    }

    async updateProduct(id: number, data: CreateProductDto) {
        await this.findProductById(id);
        await this.validateProductData(data);
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
        await this.findProductById(id);
        await this.prisma.product.delete({ where: { id } });
        return { message: 'Product deleted successfully' };
    }

    private async validateProductData(data: CreateProductDto) {
        if (this.countWords(data.name) < 3) {
            throw new BadRequestException('Product name must contain at least 3 words.');
        }

        const category = await this.prisma.category.findUnique({
            where: { id: data.category_id },
        });
        if (!category) {
            throw new BadRequestException('Category not found');
        }
    }

    private countWords(value: string) {
        let count = 0;
        let insideWord = false;

        for (const character of value.trim()) {
            const isSeparator =
                character === ' ' ||
                character === '\t' ||
                character === '\n' ||
                character === '\r';

            if (isSeparator) {
                insideWord = false;
            } else if (!insideWord) {
                count += 1;
                insideWord = true;
            }
        }

        return count;
    }
}
