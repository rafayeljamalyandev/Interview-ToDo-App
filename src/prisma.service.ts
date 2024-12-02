import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  private readonly logger = new Logger(PrismaService.name);

  constructor(configService: ConfigService) {
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
    try {
      await this.$connect();
      this.logger.log('Connected to the database successfully');
    } catch (error) {
      this.logger.error('Error connecting to the database', error.stack);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database connection closed');
  }
}
