import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Product API (e2e)', () => {
  let app: INestApplication<App>;
  const products = [
    {
      id: 1,
      name: 'Hot Caramel Latte',
      description: 'Fresh latte drink with caramel flavor',
      price: 25000,
      stock: 10,
      image_url: null,
      category_id: 1,
    },
  ];
  const categories = [{ id: 1, name: 'Coffee' }];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        product: {
          findMany: jest.fn().mockResolvedValue(products),
        },
        category: {
          findMany: jest.fn().mockResolvedValue(categories),
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/products (GET)', () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect(products);
  });

  it('/categories (GET)', () => {
    return request(app.getHttpServer())
      .get('/categories')
      .expect(200)
      .expect(categories);
  });

  afterEach(async () => {
    await app.close();
  });
});
