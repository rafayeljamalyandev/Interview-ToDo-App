import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { AuthService } from 'src/services/auth.service';
import { AuthController } from 'src/controllers/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule], 
  providers: [AuthService], 
  controllers: [AuthController], 
})
export class AuthModule {
  constructor(private readonly configService: ConfigService) {}

  public getJwtSecret(): string {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwtSecret;
  }
}
