import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/application/app/app.module';
import { AtGuard } from '../src/common/guards';

describe('TodosController (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const canActivate = jest.fn(() => true);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AtGuard)
      .useValue({ canActivate })
      .compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/GET todos (listAll)', async () => {
    await request(app.getHttpServer()).get('/todos').expect(200);
  });
});
