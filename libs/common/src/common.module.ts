import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PinoModule } from './pino/pino.module';

@Module({
  imports: [PinoModule, PrismaModule],
})
export class CommonModule {}
