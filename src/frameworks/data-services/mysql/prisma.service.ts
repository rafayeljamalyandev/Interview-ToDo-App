import { INestApplication, Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IDataServices } from '../../../core';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit  {
  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
      log: ['info'],
    });
  }


  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // @ts-ignore
    this.$on('beforeExit'  , async () => {
      await app.close();
    });
  }

}
