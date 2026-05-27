import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Transaction API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/cart (GET) requires authentication', () => {
    return request(app.getHttpServer()).get('/cart').expect(401);
  });

  it('/orders (GET) requires authentication', () => {
    return request(app.getHttpServer()).get('/orders').expect(401);
  });

  it('/profiles (GET) requires authentication', () => {
    return request(app.getHttpServer()).get('/profiles').expect(401);
  });

  afterEach(async () => {
    await app.close();
  });
});
