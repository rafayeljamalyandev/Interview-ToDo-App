import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../../prisma.module';
import { GenerateTokenService } from '../../lib/utils';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma.service';
import { BcryptService } from '../../lib/bcrypt';

@Module({
  imports: [PrismaModule],
  providers: [
    AuthService,
    GenerateTokenService,
    BcryptService,
    ConfigService,
    PrismaService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
