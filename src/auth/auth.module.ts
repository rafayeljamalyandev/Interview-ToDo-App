import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    AuthService,
    { provide: 'IUserRepository', useClass: UserRepository },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
