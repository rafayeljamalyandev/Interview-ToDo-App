import { PrismaModule } from '../../../libs/common/src/prisma/prisma.module';
import { PinoModule } from "../../../libs/common/src/pino/pino.module";
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '../src/configs/jwt.config';
import appConfig from "./configs/auth-service.config";


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, jwtConfig],
      isGlobal: true,
    }),
    JwtModule.register({}),
    PrismaModule,
    PinoModule
  ],
  providers: [AuthService, AccessTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
