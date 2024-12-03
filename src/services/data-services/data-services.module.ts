import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../frameworks/data-services/mysql/prisma.module';
// import { MongoDataServicesModule } from '../../frameworks/data-services/mysql/prisma-data-services.module';

@Module({
  imports: [DatabaseModule],
  exports: [DatabaseModule],
})
export class DataServicesModule {}
