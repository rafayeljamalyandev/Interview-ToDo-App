import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Makes the module available everywhere
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Export PrismaService for use in other modules
})
export class PrismaModule {}
