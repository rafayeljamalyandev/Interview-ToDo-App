import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JWTService } from '../common/services/jwt.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from "../common/strategies/jwt.strategy";
import { UsersService } from "../users/users.service";

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXP'),
        },
      }),
      inject: [ConfigService],
    }),
    JwtModule,
    PassportModule,
  ],
  providers: [
    AuthService,
    JWTService,
    UsersService,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
