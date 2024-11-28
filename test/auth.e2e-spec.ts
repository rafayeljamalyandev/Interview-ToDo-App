import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AuthController } from '../src/app/auth/auth.controller';
import { AuthService } from '../src/app/auth/auth.service';
import { AuthDto } from '../src/app/auth/dto/auth.dto';

describe('AuthController', () => {
  let app: INestApplication;
  const authService = {
    register: jest.fn().mockResolvedValue({
      email: 'test@mail.com',
      password: 'randString',
    }),
    login: jest
      .fn()
      .mockResolvedValue({ email: 'test@mail.com', password: 'randString' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should register a user', async () => {
    const dto: AuthDto = { email: 'test@mail.com', password: 'randString' };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(dto)
      .expect(201);

    expect(authService.register).toHaveBeenCalledWith(dto);
  });

  it('should login a user', async () => {
    const dto: AuthDto = { email: 'test@mail.com', password: 'randString' };

    await request(app.getHttpServer())
      .post('/auth/login')
      .send(dto)
      .expect(200);

    expect(authService.login).toHaveBeenCalledWith(dto);
  });

  afterAll(async () => {
    await app.close();
  });
});
