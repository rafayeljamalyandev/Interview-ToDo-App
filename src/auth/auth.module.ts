import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { JwtMiddleware } from './jwt/jwt.middleware';

@Module({
  imports: [PrismaModule],
  providers: [AuthService, JwtService, JwtMiddleware],
  controllers: [AuthController],
  exports: [JwtService],
})
export class AuthModule {}
