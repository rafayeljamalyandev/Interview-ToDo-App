import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { AuthService } from 'src/services/auth.service';
import { AuthController } from 'src/controllers/auth.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [PrismaModule],
  providers: [AuthService],
  controllers: [AuthController],
})

export class AuthModule {
  constructor(private readonly configService: ConfigService) {}

  public getJwtSecret(): (string | null) {
    return this.configService.get<string>("JWT_SECRET") ?? null;
  }
}
