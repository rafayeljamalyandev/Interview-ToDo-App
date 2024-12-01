import { Module } from '@nestjs/common';
import { MongoDataServicesModule } from '../../frameworks/data-services/mysql/prisma-data-services.module';

@Module({
  imports: [MongoDataServicesModule],
  exports: [MongoDataServicesModule],
})
export class DataServicesModule {}
