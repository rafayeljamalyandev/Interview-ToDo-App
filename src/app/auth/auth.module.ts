import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from 'src/common/token/token.module';
import { UsersModule } from 'src/services/users/users.module';

@Module({
  imports: [UsersModule, TokenModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
