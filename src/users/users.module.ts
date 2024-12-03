import { Module } from '@nestjs/common';
import { UsersService } from './users.service'; // The service handling user logic
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UsersService],
  exports: [UsersService], // Ensures the service is exported for use in other modules
})
export class UsersModule {}
