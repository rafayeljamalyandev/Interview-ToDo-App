import { INestApplication, Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IDataServices } from '../../../core';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit  {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    });
  }


  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit'  , async () => {
      await app.close();
    });
  }
}
