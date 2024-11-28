import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
// Extend PrismaClient and implement OnModuleInit for lifecycle hooks
export class PrismaService extends PrismaClient implements OnModuleInit {
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
  // Automatically connect to the database when the module initializes

  async onModuleInit() {
    await this.$connect();
  }
}
